# Camera Tracker

* Prepare OpenCV fro Java development ([tutorial](http://docs.opencv.org/doc/tutorials/introduction/desktop_java/java_dev_intro.html#java-dev-intro)):
```
git clone git://github.com/Itseez/opencv.git
cd opencv
git checkout 2.4
mkdir build
cd build
cmake -DBUILD_SHARED_LIBS=OFF ..
make -j8
```
* Clone project repository
```
git clone git@github.com:zikolach/camera_tracker.git
cd camera_tracker
```
* Copy java bindings jar file and library to project's lib directory
```
cp ../opencv/build/bin/opencv-2410.jar ./lib/
cp ../opencv/build/lib/libopencv_java2410.dylib ./lib/
```
* Type in the console to run application:
```
sbt run -Djava.library.path=lib
```
* Open http://localhost:8000 in your favourite browser (Chrome, Mozilla)
* Enjoy!!!
