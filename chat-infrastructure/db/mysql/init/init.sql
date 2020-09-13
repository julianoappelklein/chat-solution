CREATE TABLE `db`.`chat_message` (
    `id` BIGINT NOT NULL,
    `user_id` VARCHAR(100) NOT NULL,
    `chat_room_id` VARCHAR(20) NOT NULL,
    `message` VARCHAR(500) NOT NULL,
    `created_on` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `db`.`user` (
    `id` BIGINT NOT NULL,
    `userName` VARCHAR(30) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `message` VARCHAR(500) NOT NULL,
    PRIMARY KEY (`id`)
);