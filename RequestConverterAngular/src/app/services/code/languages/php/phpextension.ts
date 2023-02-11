import { RequestType, SRequest } from "../../../request/request";
import { WebsocketFormatter, FormatterExtension } from "../../code.service";

export class PhpExtension extends FormatterExtension {

  _Language = "PHP";

  WriteAboveRequests() {
    this.SetResult("<?php");
    this.SetResult("class " + this.ClassName + " {");
  }
  WriteBelowRequests() {
    this._Indent = "";
    this.SetResult("}");
    this.SetResult("?>");
  }
}
