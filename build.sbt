import com.mojolly.scalate.ScalatePlugin.{Binding, ScalateKeys, TemplateConfig, _}

name         := "cam-track"

version      := "1.0-SNAPSHOT"

scalaVersion := "2.11.2"
//scalaVersion := "2.10.4"

scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked")

// Xitrum requires Java 7
javacOptions ++= Seq("-source", "1.8", "-target", "1.8")

//------------------------------------------------------------------------------

libraryDependencies += "tv.cntt" %% "xitrum" % "3.18"

// Xitrum uses SLF4J, an implementation of SLF4J is needed
libraryDependencies += "ch.qos.logback" % "logback-classic" % "1.1.2"
//libraryDependencies += "org.slf4j" % "slf4j-simple" % "1.7.7"

// For writing condition in logback.xml
libraryDependencies += "org.codehaus.janino" % "janino" % "2.7.5"

libraryDependencies += "org.webjars" % "bootstrap" % "3.2.0"

// Scalate template engine config for Xitrum -----------------------------------

libraryDependencies += "tv.cntt" %% "xitrum-scalate" % "2.2"

libraryDependencies ++= Seq(
  "org.webjars" % "requirejs" % "2.1.14-3",
  "org.webjars" % "jquery" % "2.1.1",
  "org.webjars" % "underscorejs" % "1.7.0",
  "org.webjars" % "sockjs-client" % "0.3.4",
  "org.webjars" % "angularjs" % "1.3.0"
)

// Precompile Scalate templates
Seq(scalateSettings:_*)

ScalateKeys.scalateTemplateConfig in Compile := Seq(TemplateConfig(
  baseDirectory.value / "src" / "main" / "scalate",
  Seq(),
  Seq(Binding("helper", "xitrum.Action", importMembers = true))
))

// xgettext i18n translation key string extractor is a compiler plugin ---------

autoCompilerPlugins := true

addCompilerPlugin("tv.cntt" %% "xgettext" % "1.2")

scalacOptions += "-P:xgettext:xitrum.I18n"

// Put config directory in classpath for easier development --------------------

// For "sbt console"
unmanagedClasspath in Compile <+= baseDirectory map { bd => Attributed.blank(bd / "config") }

// For "sbt run"
unmanagedClasspath in Runtime <+= baseDirectory map { bd => Attributed.blank(bd / "config") }

resourceDirectory in Compile <<= baseDirectory {_ / "src" / "main" / "resources"}

// Copy these to target/xitrum when sbt xitrum-package is run
XitrumPackage.copy("config", "public", "script")
