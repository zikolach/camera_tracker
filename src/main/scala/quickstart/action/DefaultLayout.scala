package quickstart.action

import xitrum.Action

trait DefaultLayout extends Action {

  val jsLibs = List(
    "sockjs-client/0.3.4/sockjs.js",
    "jquery/2.1.1/jquery.js",
    "underscorejs/1.7.0/underscore.js",
    "angularjs/1.3.0/angular.js",
    "angularjs/1.3.0/angular-route.js",
    "bootstrap/3.2.0/js/bootstrap.js"
  )
  val jsLibsURLS = jsLibs.map(
    jsURL => s"\nwindow.${toCamel(jsURL.reverse.takeWhile(_ != '/').reverse.takeWhile(_ != '.'))}URL = '${webJarsUrl(jsURL)}';"
  )

  def toCamel(name: String) = "[_-]([a-z\\d])".r.replaceAllIn(name, {m =>
    m.group(1).toUpperCase
  })

  override def layout = {
    at("jsLibsURLS") = jsLibsURLS
    at("bootstrapCssURL") = webJarsUrl("bootstrap/3.2.0/css", "bootstrap.css", "bootstrap.min.css")
    at("faviconURL") = publicUrl("favicon.ico")
    at("appCssURL") = publicUrl("app.css")
    at("requireJsURL") = webJarsUrl("requirejs/2.1.14-3", "require.js", "require.min.js")
//    at("mainJsURL") = publicUrl("js/main.js")
    at("mainJsURL") = "js/main.js"
    at("siteIndexURL") = url[SiteIndex]
    at("renderedView") = renderedView
    renderViewNoLayout[DefaultLayout]()
  }
}
