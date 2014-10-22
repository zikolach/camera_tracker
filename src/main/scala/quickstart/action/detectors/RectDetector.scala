package quickstart.action.detectors

import akka.actor.{Props, Actor}
import org.opencv.core.Mat
import quickstart.action.FeatureRequest
import quickstart.action.detectors.RectDetector.{QuadrangleResponse, Point, Quadrangle}

import scala.language.postfixOps

object RectDetector {
  case class Point(x: Int, y: Int)
  case class Quadrangle(a: Point, b: Point, c: Point, d: Point)
  case class QuadrangleResponse(ts: Long, rects: List[Quadrangle])
  lazy val props = Props[RectDetector]
}

class RectDetector extends Actor {

  override def receive = {
    case FeatureRequest(ts, image) =>
      sender ! QuadrangleResponse(ts, List(Quadrangle(Point(0, 0), Point(image.width() - 1, 0), Point(image.width() - 1, image.height() - 1), Point(0, image.height() - 1))))
  }

}