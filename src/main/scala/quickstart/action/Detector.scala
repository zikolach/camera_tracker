package quickstart.action

import org.opencv.core._
import org.opencv.highgui.Highgui
import quickstart.action.detectors.FaceDetector.{Face, FacesResponse}
import quickstart.action.detectors.RectDetector.QuadrangleResponse
import quickstart.action.detectors.{FaceDetector, RectDetector}
import xitrum.annotation.SOCKJS
import xitrum.util.SeriDeseri
import xitrum.{SockJsAction, SockJsText}

import scala.language.postfixOps

case class CaptureMessage(timestamp: Long, image: String, features: Option[Set[String]])

case class FeaturesMessage(timestamp: Long,
                           faces: Option[List[Face]],
                           rects: Option[List[RectDetector.Quadrangle]])

case class FeatureRequest(ts: Long, image: Mat)

@SOCKJS("echo")
class Detector extends SockJsAction {

  val imageData = "data:image/([a-z]+);base64,(.*)".r

  lazy val featureDetectors = Map(
    "face" -> context.actorOf(FaceDetector.props, name = "faceDetector"),
    "rect" -> context.actorOf(RectDetector.props, name = "rectDetector")
  )

  def execute() {
    log.info("onOpen")
    context become {
      case SockJsText(text) =>
        SeriDeseri.fromJson[CaptureMessage](text) match {
          case Some(CaptureMessage(ts, imgData, features)) =>
            imgData match {
              case imageData(mimetype, data) =>
                SeriDeseri.bytesFromBase64(data) match {
                  case Some(imageBytes) =>
                    val m = new MatOfByte(imageBytes: _*)
                    val image = Highgui.imdecode(m, Highgui.IMREAD_COLOR)
                    val req = FeatureRequest(ts, image)
                    for (featureDetector <- featureDetectors) {
                      if (features.isEmpty || features.exists(_.contains(featureDetector._1))) {
                        featureDetector._2 ! req
                      }
                    }
                  case a =>
                }
            }
          case _ =>
            log.warn("Unknown message")
        }
      case FacesResponse(ts: Long, faces) =>
        log.info(s"Detected faces - ${faces.length}")
        respondSockJsJson(FeaturesMessage(ts, Some(faces), None))
      case QuadrangleResponse(ts: Long, rects: List[RectDetector.Quadrangle]) =>
        log.info(s"Detected rects - ${rects.length}")
        respondSockJsJson(FeaturesMessage(ts, None, Some(rects)))
    }
  }

  override def postStop() {
    log.info("onClose")
    super.postStop()
  }
}