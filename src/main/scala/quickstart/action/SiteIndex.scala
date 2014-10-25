package quickstart.action

import xitrum.{SockJsText, SockJsAction, Action}
import xitrum.annotation.{SOCKJS, GET}

@GET("")
class SiteIndex extends DefaultLayout {
  def execute() {
    respondView()
  }
}

