import { jsx } from "react/jsx-runtime";
import "react";
import CalendarView from "./CalendarView-Cuwozy6W.js";
import "@inertiajs/react";
import "lucide-react";
import "./PageHeader-Dbzk0fkj.js";
import "./AppLayout-rxyXD7Jy.js";
import "axios";
function ShowGroup({ group, strategies }) {
  return /* @__PURE__ */ jsx(CalendarView, { strategies, isGroup: true, entity: group });
}
export {
  ShowGroup as default
};
