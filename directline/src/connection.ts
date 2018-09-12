import * as crypto from "crypto";
import { Activity, Message } from "botframework-directlinejs";

export const genToken = (): string => {
  return crypto.randomBytes(63).toString("base64");
};

export const genConversationId = (): string => {
  return crypto.randomBytes(12).toString("hex");
};


export function replace<T>(
    arr: T[],
    predicate: (elem: T) => boolean,
    replacement: T
  ): T[] {
    let found = arr.findIndex(predicate);
    if (found > -1) {
      var copy = arr.splice(0);
      copy.splice(found, 1, replacement);
      return copy;
    } else {
      return arr;
    }
  }

namespace ConnectionRegistry {
  type Poll = {
    convId: string
    activityGroups: ActivityGroup[]
  }
  
  var polls: Poll[] = []

  function latestActivityGroupByWatermark(groups: ActivityGroup[]): ActivityGroup {
    var latest: ActivityGroup = { activities: [], watermark: "0"};
    groups.forEach(group => {
        let wm: number = parseInt(group.watermark)
        let latestWm: number = parseInt(latest.watermark)
        if (wm >= latestWm) {
          latest = group
        }
      })
    return latest
  }
  
  export function addActivities(convId: string, activities: Activity[]) {
    
    let found = polls.find(p => p.convId === convId)
    if (found) {
      let latest = latestActivityGroupByWatermark(found.activityGroups)
      let newAg = { activities: activities, watermark: (parseInt(latest.watermark) + 1).toString() }
      polls = replace<Poll>(polls, p => p.convId === convId, { convId , activityGroups: found.activityGroups.concat(newAg) })
    } else polls.push({ convId, activityGroups: [ { activities: activities, watermark: "1"} ] })
  }

  export function latestActivity(convId: string): ActivityGroup {
    let pollFound = polls.find(poll => poll.convId === convId)
    var found: ActivityGroup = { activities: [], watermark: "0" }
    if (pollFound) {
      found = latestActivityGroupByWatermark(pollFound.activityGroups)
    }
    return found
  }

  export function pollConsumed(convId: string, watermark: string): void {
    let found = polls.find(c => c.convId === convId)
    if (found) {
      let marked = replace<ActivityGroup>(found.activityGroups, ag => ag.watermark === watermark, { activities: [], watermark })
      polls = replace<Poll>(polls, p => p.convId === convId, { convId, activityGroups: marked })
    }
  }

}

export const bot = { id: "jsmeetuplubot", name: "Js Meetup LU" }

export type ActivityGroup = {
  activities: Activity[];
  watermark: string;
};

export { ConnectionRegistry };
