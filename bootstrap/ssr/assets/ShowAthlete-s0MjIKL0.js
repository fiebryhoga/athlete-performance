import { jsx } from "react/jsx-runtime";
import "react";
import CalendarView from "./CalendarView-CQQZVzGk.js";
import "@inertiajs/react";
import "lucide-react";
import "./PageHeader-Dbzk0fkj.js";
import "./AppLayout-BFWH9KqI.js";
import "axios";
function ShowAthlete({ athlete, strategies }) {
  return /* @__PURE__ */ jsx(CalendarView, { strategies, isGroup: false, entity: athlete });
}
export {
  ShowAthlete as default
};
