package quickstart.action

import org.opencv.core._
import org.opencv.highgui.Highgui
import org.opencv.objdetect.CascadeClassifier
import xitrum.util.SeriDeseri
import xitrum.{SockJsText, SockJsAction}
import xitrum.annotation.SOCKJS
import scala.collection.JavaConverters._
import scala.language.postfixOps

case class CaptureMessage(timestamp: Long, image: String)

case class FacesMessage(timestamp: Long, faces: List[(Int, Int, Int, Int)])

case class FramePartMessage(timestamp: Long, total: Int, part: Int, data: String)

@SOCKJS("echo")
class FaceDetector extends SockJsAction {

  val imageData = "data:image/([a-z]+);base64,(.*)".r
  val faceDetector: CascadeClassifier  = new CascadeClassifier(getClass.getResource("/lbpcascade_frontalface.xml").getPath)

  def execute() {
    log.info("onOpen")

    context.become {
      case SockJsText(text) =>
        SeriDeseri.fromJson[CaptureMessage](text) match {
          case Some(CaptureMessage(ts, imgData)) =>
            log.info(s"timestamp: $ts")
            imgData match {
              case imageData(mimetype, data) =>
                log.info(s"timestamp: $mimetype")
                SeriDeseri.fromBase64(data) match {
                  case Some(imageBytes) =>
                    val m = new MatOfByte(imageBytes: _*)
                    val png = Highgui.imdecode(m, Highgui.IMREAD_COLOR)
                    log.info(s"${png.width()}x${png.height()}")
                    val faceDetections = new MatOfRect()
                    faceDetector.detectMultiScale(png, faceDetections)
                    respondSockJsJson(FacesMessage(ts, faceDetections.toList.asScala.map {
                      case rect => (rect.x, rect.y, rect.width, rect.height)
                    } toList))
//                    faceDetections.toArray.foreach {
//                      case rect =>
//                        log.info(s"rect(${rect.x},${rect.y},${rect.width},${rect.height})")
//                        Core.rectangle(png, new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y + rect.height), new Scalar(0, 255, 0))
//                    }
//                    Highgui.imencode(s".$mimetype", png, m)
//                    respondSockJsJson(CaptureMessage(ts, s"data:image/$mimetype;base64,${SeriDeseri.toBase64(m.toArray)}"))
                  case _ =>
                }
            }
          case _ =>
            log.warn("Unknown message")
        }
    }
  }

  override def postStop() {
    log.info("onClose")
    super.postStop()
  }
}