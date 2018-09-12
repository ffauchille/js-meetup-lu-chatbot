import * as request from "request";
import { Observable, of } from "rxjs";
import { Observer } from "rxjs/internal/types";
import { map, take, timeout, catchError } from "rxjs/operators";
import { joinPath } from "../utils";
import { HTTPError } from "./types";



// Singleton keeping access token
namespace MeetupApi {

  // construct meetup's URL with api key auth method
  function url(resourcePath: string): string {
    let res = joinPath(process.env.MEETUP_ENDPOINT || "", resourcePath)
    res += resourcePath.includes("?") ? "&" : "?";
    res += `key=${process.env.MEETUP_API_KEY}&signed=true`
    console.log("MeetupAPI: url construct is:", res);
    return res;
  }

  /**
   *
   * Simply cast request's response to expected type (T) and wrap it to the observer
   *
   */
  function observerWrapResponse<T>(
    observer: Observer<T>,
    construct: (pl: any) => T,
    err: Error,
    response: request.Response,
    body: any,
    expectedResponseCode: number
  ) {
    if (!err) {
      if (response) {
        if (response.statusCode === expectedResponseCode) {
          let json = typeof body === "string" ? JSON.parse(body) : response;
          observer.next(construct(json));
        } else
          observer.error(
            new HTTPError(
              `Unexpected response code (expected: ${expectedResponseCode})`,
              response.statusCode,
              body
            )
          );
      } else observer.error(new Error("No response object"));
    } else observer.error(err);
  }

  /**
   *
   * Authenticated one-shot get request
   * 
   * @param resourcePath  resource path (e.g. /api/now/incident)
   * @param expectedResponseCode (optional) expected HTTP response code; default is 200
   */
  export function get<T>(
    resourcePath: string,
    construct: (pl: any) => T,
    expectedResponseCode?: number
  ): Observable<T> {
    return Observable.create((observer: Observer<T>) =>
          request.get(
            url(resourcePath),
            { headers: { "Content-Type": "application/json" }},
            (err: Error, response: request.Response, body) =>
              observerWrapResponse(
                observer,
                construct,
                err,
                response,
                body,
                expectedResponseCode ? expectedResponseCode : 200
              )
          )
        ).pipe(
          timeout(2000),
          take(1)
        );
  }
}

export { MeetupApi };

