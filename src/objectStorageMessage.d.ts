export namespace YC {

    export interface TracingContext {
        trace_id: string;
        span_id: string;
        parent_span_id: string;
    }

    export interface EventMetadata {
        event_id: string;
        event_type: string;
        created_at: Date;
        tracing_context: TracingContext;
        cloud_id: string;
        folder_id: string;
    }

    export interface Details {
        bucket_id: string;
        object_id: string;
    }

    export interface Message {
        event_metadata: EventMetadata;
        details: Details;
    }

    export interface ObjectStorageEvent {
        messages: Message[];
    }
}



