export class MeetupEvents {
  results: MeetupEvent[];
  meta: MeetupEventsMeta;

  constructor(props: Partial<MeetupEvents>) {
    this.results = (props.results || []).map(e => new MeetupEvent(e));
    this.meta = props.meta || new MeetupEventsMeta({});
  }
}

class MeetupEventsMeta {
  next: string;
  method: string;
  total_count: number;
  link: string;
  count: number;
  description: string;
  lon: string;
  title: string;
  url: string;
  signed_url: string;
  id: string;
  updated: number;
  lat: string;

  constructor(props: Partial<MeetupEventsMeta>) {
    this.next = props.next || "";
    this.method = props.method || "";
    this.total_count = props.total_count || 0;
    this.link = props.link || "";
    this.count = props.count || 0;
    this.description = props.description || "";
    this.lon = props.lon || "";
    this.title = props.title || "";
    this.url = props.url || "";
    this.signed_url = props.signed_url || "";
    this.id = props.id || "";
    this.updated = props.updated || new Date("2010-01-01").getTime();
    this.lat = props.lat || "";
  }
}

export class MeetupEvent {
  utc_offset: number;
  venue: MeetupVenue;
  rsvp_limit?: number;
  headcount: number;
  visibility: string;
  waitlist_count: number;
  created: number;
  maybe_rsvp_count: number;
  description: string;
  how_to_find_us: string;
  event_url: string;
  yes_rsvp_count: number;
  duration: number;
  name: string;
  id: string;
  time: number;
  updated: number;
  group: MeetupGroup;
  status: string;

  constructor(props: Partial<MeetupEvent>) {
    this.utc_offset = props.utc_offset || 0;
    this.venue = props.venue || new MeetupVenue({});
    this.rsvp_limit = props.rsvp_limit || 0;
    this.headcount = props.headcount || 0;
    this.visibility = props.visibility || "";
    this.waitlist_count = props.waitlist_count || 0;
    this.created = props.created || 0;
    this.maybe_rsvp_count = props.maybe_rsvp_count || 0;
    this.description = props.description || "";
    this.how_to_find_us = props.how_to_find_us || "";
    this.event_url = props.event_url || "";
    this.yes_rsvp_count = props.yes_rsvp_count || 0;
    this.duration = props.duration || 0;
    this.name = props.name || "JS Meetup event";
    this.id = props.id || "";
    this.time = props.time || 0;
    this.updated = props.updated || 0;
    this.group = props.group || new MeetupGroup({});
    this.status = props.status || "";
  }
}

class MeetupGroup {
  join_mode: string;
  created: number;
  name: string;
  group_lon: number;
  id: number;
  urlname: string;
  group_lat: number;
  who: string;

  constructor(props: Partial<MeetupGroup>) {
    this.join_mode = props.join_mode || "";
    this.created = props.created || new Date("2010-01-01").getTime();
    this.name = props.name || "";
    this.group_lon = props.group_lon || 0;
    this.id = props.id || 0;
    this.urlname = props.urlname || "";
    this.group_lat = props.group_lat || 0;
    this.who = props.who || "";
  }
}

class MeetupVenue {
  country: string;
  localized_country_name: string;
  city: string;
  address_1: string;
  name: string;
  lon: number;
  id: number;
  lat: number;
  repinned: boolean;

  constructor(props: Partial<MeetupVenue>) {
    this.country = props.country || "";
    this.localized_country_name = props.localized_country_name || "";
    this.city = props.city || "";
    this.address_1 = props.address_1 || "";
    this.name = props.name || "";
    this.lon = props.lon || 0;
    this.id = props.id || 0;
    this.lat = props.lat || 0;
    this.repinned = props.repinned || false;
  }
}
