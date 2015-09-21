package quickstart.action

import xitrum.Action

trait DefaultLayout extends Action {

  val jsLibs = List(
    "sockjs-client/1.0.2/sockjs.js",
    "jquery/2.1.4/jquery.js",
    "underscorejs/1.8.3/underscore.js",
    "angularjs/1.4.4/angular.js",
    "angularjs/1.4.4/angular-route.js",
    "bootstrap/3.3.5/js/bootstrap.js"
  )
  val jsLibsURLS = jsLibs.map(
    jsURL => s"\nwindow.${toCamel(jsURL.reverse.takeWhile(_ != '/').reverse.takeWhile(_ != '.'))}URL = '${webJarsUrl(jsURL)}';"
  )

  def toCamel(name: String) = "[_-]([a-z\\d])".r.replaceAllIn(name, {m =>
    m.group(1).toUpperCase
  })

  override def layout = {
    at("jsLibsURLS") = jsLibsURLS
    at("bootstrapCssURL") = webJarsUrl("bootstrap/3.3.5/css", "bootstrap.css", "bootstrap.min.css")
    at("faviconURL") = publicUrl("favicon.ico")
    at("appCssURL") = publicUrl("app.css")
    at("requireJsURL") = webJarsUrl("requirejs/2.1.20", "require.js", "require.min.js")
//    at("mainJsURL") = publicUrl("js/main.js")
    at("mainJsURL") = "js/main.js"
    at("siteIndexURL") = url[SiteIndex]
    at("renderedView") = renderedView
    renderViewNoLayout[DefaultLayout]()
  }
}
