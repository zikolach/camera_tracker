package quickstart

import org.opencv.core._
import org.opencv.highgui.Highgui
import xitrum.Server

object Boot {
  def main(args: Array[String]) {
//    xitrum.Log.info(System.getProperty("java.library.path"))
    System.loadLibrary(Core.NATIVE_LIBRARY_NAME)
//    val image: Mat = Highgui.imread(getClass.getResource("/lena.png").getPath)
    Server.start()
  }
}
