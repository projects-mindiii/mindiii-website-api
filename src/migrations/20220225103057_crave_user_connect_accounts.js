/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('crave_user_connect_accounts', function(table) {
            table.increments('id');
            table.integer('user_id', 10).unsigned();
            table.foreign('user_id').references('id').inTable('crave_users');
            table.tinyint('status', 4).defaultTo('1').comment("0:In-active, 1:active");
            table.string('facbook_social_key', 50);
            table.string('facebook_social_email', 50);
            table.string('twitter_social_key', 50);
            table.string('twitter_social_email', 50);
            table.string('google_social_key', 50);
            table.string('google_social_email', 50);
            table.timestamps();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropSchema('crave_user_connect_accounts');

};