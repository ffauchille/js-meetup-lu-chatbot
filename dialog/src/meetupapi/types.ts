/**
 * {"access_token":"BctuKBTE0EdYLvOkP3dUbhJ4Z-dytS_VfReJJcH6Zav7h_7EJaaOnAwKTOfVM_bFnyIJ3WyN_92OhiqSkeoTxw",
 * "refresh_token":"a52IMGp5s3bHTe33GdFiEUu4S2AEqRbBW1YY45EQMQUw3clKVIuxnBaqdRx1I31KWzvvrn0VgJN9y2mZWgr_OA",
 * "scope":"useraccount",
 * "token_type":"Bearer",
 * "expires_in":1799}
 */
export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
};

type MySnowAppClient = {
  clientId: string;
  clientSecret: string;
};
type MySnowUser = {
  username: string;
  password: string;
};

export type RequestedFor = {
  id: string;
  name: string;
};

export class HTTPError extends Error {
  code: number;
  body: any;
  constructor(msg: string, code: number, body: any) {
    super(msg);
    this.code = code;
    this.body = body;
  }
}

export type MySnowRequestResponse = {
  result: {
    parent?: string;
    delivery_address?: string;
    watch_list?: string;
    upon_reject?: string;
    requested_for?: {
      link?: string;
      value?: string;
    };
    sys_updated_on?: string;
    approval_history?: string;
    u_unnotify_user?: string;
    number?: string;
    u_business_service?: string;
    sys_updated_by?: string;
    opened_by?: {
      link?: string;
      value?: string;
    };
    user_input?: string;
    price?: string;
    sys_created_on?: string;
    sys_domain?: {
      link?: string;
      value?: string;
    };
    state?: string;
    sys_created_by?: string;
    knowledge?: string;
    order?: string;
    calendar_stc?: string;
    special_instructions?: string;
    closed_at?: string;
    cmdb_ci?: string;
    delivery_plan?: string;
    impact?: string;
    u_work_notes_list?: string;
    active?: string;
    business_service?: string;
    priority?: string;
    time_worked?: string;
    expected_start?: string;
    u_other_service?: string;
    opened_at?: string;
    business_duration?: string;
    group_list?: string;
    sourceable?: string;
    work_end?: string;
    approval_set?: string;
    wf_activity?: string;
    work_notes?: string;
    short_description?: string;
    correlation_display?: string;
    delivery_task?: string;
    work_start?: string;
    assignment_group?: string;
    additional_assignee_list?: string;
    description?: string;
    calendar_duration?: string;
    u_number_of_call_relaunch?: string;
    close_notes?: string;
    service_offering?: string;
    sys_class_name?: string;
    closed_by?: string;
    follow_up?: string;
    sys_id?: string;
    contact_type?: string;
    sourced?: string;
    urgency?: string;
    requested_date?: string;
    company?: string;
    reassignment_count?: string;
    activity_due?: string;
    assigned_to?: string;
    u_external_reference?: string;
    comments?: string;
    u_awaiting_for?: string;
    approval?: string;
    comments_and_work_notes?: string;
    due_date?: string;
    sys_mod_count?: string;
    sys_tags?: string;
    request_state?: string;
    stage?: string;
    upon_approval?: string;
    u_close_code?: string;
    correlation_id?: string;
    location?: string;
    u_sla_resolution_due_date?: string;
  };
};


export type MySnowGroupResponse = {
  result: {
    parent: string;
    manager: string;
    roles: string;
    sys_mod_count: string;
    active: string;
    description: string;
    source: string;
    sys_updated_on: string;
    sys_tags: string;
    type: string;
    u_level: string;
    sys_id: string;
    sys_updated_by: string;
    cost_center: string;
    default_assignee: string;
    hourly_rate: string;
    sys_created_on: string;
    name: string;
    exclude_manager: string;
    u_is_service_desk: string;
    u_major_incident_manager: string;
    email: string;
    include_members: string;
    sys_created_by: string;
  }[];
}

export type MySnowUserResponse = {
  result: {
    calendar_integration: string;
    country: string;
    user_password: string;
    last_login_time: string;
    source: string;
    sys_updated_on: string;
    u_assistant_e: string;
    building: string;
    u_item: string;
    notification: string;
    enable_multifactor_authn: string;
    sys_updated_by: string;
    sso_source: string;
    sys_created_on: string;
    sys_domain: Sysdomain;
    state: string;
    u_metier: string;
    vip: string;
    sys_created_by: string;
    zip: string;
    home_phone: string;
    time_format: string;
    last_login: string;
    default_perspective: string;
    u_metiermpt: string;
    active: string;
    u_profil: string;
    cost_center: string;
    phone: string;
    u_matricule: string;
    name: string;
    employee_number: string;
    u_grade: string;
    password_needs_reset: string;
    gender: string;
    city: string;
    failed_attempts: string;
    user_name: string;
    roles: string;
    title: string;
    sys_class_name: string;
    u_secret_question: string;
    sys_id: string;
    internal_integration_user: string;
    ldap_server: Sysdomain;
    mobile_phone: string;
    street: string;
    company: Sysdomain;
    u_status: string;
    department: Sysdomain;
    u_rib: string;
    first_name: string;
    email: string;
    introduction: string;
    preferred_language: string;
    u_business_unit_code: string;
    manager: Sysdomain;
    locked_out: string;
    u_response: string;
    auditor: string;
    sys_mod_count: string;
    last_name: string;
    photo: string;
    middle_name: string;
    sys_tags: string;
    time_zone: string;
    u_cib: string;
    schedule: string;
    u_divisionlabel: string;
    u_divisioncode: string;
    u_profilmpt: string;
    date_format: string;
    location: Sysdomain;
  }[];
};

type Sysdomain = {
  link: string;
  value: string;
};

export type MySnowClientConfig = {
  user: MySnowUser;
  appClient: MySnowAppClient;
};