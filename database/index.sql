CLUSTER message USING create_action_id_idx;

CREATE INDEX action_idx ON action (action_type, id);

CLUSTER action USING action_idx;

CREATE INDEX author_batch_idx ON author_message_batch (is_latest, action_id);

CLUSTER author_message_batch USING author_batch_idx;

CREATE INDEX text_batch_idx ON text_message_batch (is_latest, action_id);

CLUSTER text_message_batch USING text_batch_idx;

CREATE INDEX likes_batch_idx ON likes_message_batch (is_latest, action_id);

CLUSTER likes_message_batch USING likes_batch_idx;