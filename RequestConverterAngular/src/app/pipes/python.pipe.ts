import { Pipe, PipeTransform } from '@angular/core';
import { forEach } from 'jszip';
import { RequestType, SRequest } from '../welcome-modal/welcome-modal.component';

@Pipe({
  name: 'python'
})
export class PythonPipe implements PipeTransform {

  transform(request: SRequest): string {

    let PythonResult:string = "";

    PythonResult += "reqHeaders = OrderedDict([";
    PythonResult += "\n";

    request.headers.forEach(function (header) {
      PythonResult += "    (\"" + header.item1 + "\", \"" + header.item2 + "\"),\n"
    });

    PythonResult += "])\n\n";

    if (request.requestType == RequestType.GET) {
      PythonResult += "getProfileReq = RequestSession.get('" + request.url + "', proxies =" +
        " Account.ProxyDict, cookies = Account.CookieDict, headers = reqHeaders, verify = False)\n";
      PythonResult += "getProfileResponse = getProfileReq.text";
    }

    if (request.requestType == RequestType.POST) {
      PythonResult += "reqBody = \"" + request.requestBody + "\"\n";
      PythonResult += "getProfileReq = RequestSession.post('" + request.url + "', data = reqBody, proxies =" +
        " Account.ProxyDict, cookies = Account.CookieDict, headers = reqHeaders, verify = False)\n";
      PythonResult += "getProfileResponse = getProfileReq.text";
    }

    return PythonResult;
  }
}
