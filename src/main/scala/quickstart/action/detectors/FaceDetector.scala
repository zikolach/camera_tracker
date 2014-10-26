package quickstart.action.detectors

import akka.actor.{Props, Actor}
import org.opencv.core.{MatOfRect, Mat}
import org.opencv.objdetect.CascadeClassifier
import quickstart.action.FeatureRequest
import quickstart.action.detectors.FaceDetector.{FacesResponse, Face}
import scala.collection.JavaConverters._

import scala.language.postfixOps

object FaceDetector {
  case class Face(x: Int, y: Int, w: Int, h: Int)
  case class FacesResponse(ts: Long, faces: List[Face])
  lazy val props = Props[FaceDetector]
  lazy val kind = "face"
}

class FaceDetector extends Actor {

  val faceDetector: CascadeClassifier  = new CascadeClassifier(getClass.getResource("/lbpcascade_frontalface.xml").getPath)

  override def receive = {
    case FeatureRequest(ts, image) =>
      val faceDetections = new MatOfRect()
      faceDetector.detectMultiScale(image, faceDetections)
      sender ! FacesResponse(ts, faceDetections.toList.asScala.toList.map {
        case rect => Face(rect.x, rect.y, rect.width, rect.height)
      })
  }

}