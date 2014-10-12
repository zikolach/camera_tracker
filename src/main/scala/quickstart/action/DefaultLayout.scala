package quickstart.action

import xitrum.Action

trait DefaultLayout extends Action {
  override def layout = {
    // webjars/sockjs-client/0.3.4/sockjs
    renderViewNoLayout[DefaultLayout]()
  }
}
