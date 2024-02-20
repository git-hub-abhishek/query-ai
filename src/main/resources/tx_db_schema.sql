CREATE TABLE `tx_follows` (
  `following_user_id` integer PRIMARY KEY,
  `followed_user_id` integer,
  `created_at` timestamp
);

CREATE TABLE `tx_users` (
  `id` integer PRIMARY KEY,
  `username` varchar(255),
  `role` varchar(255),
  `created_at` timestamp
);
CREATE TABLE `tx_posts` (
  `id` integer PRIMARY KEY,
  `title` varchar(255),
  `body` text COMMENT 'Content of the post',
  `user_id` integer,
  `status` varchar(255),
  `created_at` timestamp
);

ALTER TABLE `tx_posts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `tx_follows` ADD FOREIGN KEY (`following_user_id`) REFERENCES `users` (`id`);
ALTER TABLE `tx_follows` ADD FOREIGN KEY (`followed_user_id`) REFERENCES `users` (`id`);