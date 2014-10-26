package quickstart.action.detectors

import java.util

import akka.actor.{Props, Actor}
import org.opencv.core._
import quickstart.action.FeatureRequest
import quickstart.action.detectors.RectDetector.{QuadrangleResponse, Point, Quadrangle}
import org.opencv.imgproc.Imgproc._
import scala.collection.JavaConversions._


import scala.language.postfixOps

object RectDetector {
  case class Point(x: Int, y: Int)
  case class Quadrangle(a: Point, b: Point, c: Point, d: Point)
  case class QuadrangleResponse(ts: Long, rects: List[Quadrangle])
  lazy val props = Props[RectDetector]
  lazy val kind = "rect"
}

class RectDetector extends Actor {

  private def angle(pt1: org.opencv.core.Point,
                    pt2: org.opencv.core.Point ,
                    pt0: org.opencv.core.Point): Double =  {
    val dx1 = pt1.x - pt0.x
    val dy1 = pt1.y - pt0.y
    val dx2 = pt2.x - pt0.x
    val dy2 = pt2.y - pt0.y
    (dx1*dx2 + dy1*dy2)/Math.sqrt((dx1*dx1 + dy1*dy1)*(dx2*dx2 + dy2*dy2) + 1e-10)
  }

  private def approximate(curve: MatOfPoint2f, ratio: Double): MatOfPoint2f = {
    val approxCurve = new MatOfPoint2f()
    approxPolyDP(curve, approxCurve, arcLength(curve, true) * ratio, true)
    approxCurve
  }

  private def isConvex(curve: MatOfPoint2f): Boolean =
    isContourConvex(new MatOfPoint(curve.toArray:_*))

  private def perimeter(curve: MatOfPoint2f): Double = Math.abs(arcLength(curve, true))

  private def findCont(source: Mat): List[MatOfPoint] = {
    val thresh = 50
    val N = 10
    val timg: Mat = new Mat(source.size(), source.`type`())
    val gray0 = new Mat(source.size(), CvType.CV_8U)
    val gray = new Mat()
    medianBlur(source, timg, 5)
    (0 to 2).map(c => {
      Core.mixChannels(List(timg), List(gray0), new MatOfInt(c, 0))
      (0 to N).map (l => {
        val contours = new util.ArrayList[MatOfPoint]()
        if (l == 0) {
          Canny(gray0, gray, 5, thresh)
          dilate(gray, gray, new Mat(), new org.opencv.core.Point(-1, -1), 1)
        } else {
          threshold(gray0, gray, (l + 1) * 255 / N, 255, THRESH_BINARY)
        }
        findContours(gray, contours, new Mat(), RETR_LIST, CHAIN_APPROX_SIMPLE)
        contours
      })
    }).flatten.flatten.toList
  }

  override def receive = {
    case FeatureRequest(ts, image) =>
      val minPerimeter = image.total() / 256
      val squares = findCont(image).toList.map(contour =>
        approximate(new MatOfPoint2f(contour.toArray:_*), 0.02)
      ).filter(approxCurve =>
        approxCurve.toList.length == 4 && perimeter(approxCurve) > minPerimeter && isConvex(approxCurve)
        ).map(approxCurve => {
        val approx = approxCurve.toList
        val maxCosine = (2 to 4).map(
          j => Math.abs(angle(approx.get(j % 4), approx.get(j-2), approx.get(j-1)))
        ).max
        (approx, maxCosine)
      }).filter(_._2 < 0.3).map(p => {
        p._1.take(4).map(p => Point(p.x.toInt, p.y.toInt)).toList match {
          case a1 :: a2 :: a3 :: a4 :: Nil => Quadrangle(a1, a2, a3, a4)
        }
      })
      sender ! QuadrangleResponse(ts, squares)
  }

}