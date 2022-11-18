/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('crave_users_pictures', function(table) {
            table.increments('id');
            table.integer('user_id', 10).unsigned();
            table.foreign('user_id').references('id').inTable('crave_users');
            table.string('name', 100);
            table.tinyint('type', 4).defaultTo('0').comment("0:temporary, 1:pending, 2:public, 3:adult/private,4:rejected");
            table.tinyint('is_profile', 4).defaultTo('2').comment("1:profile picture, 2:other pictures");
            table.tinyint('is_socail_picture', 4).defaultTo('0').comment("0: no social picture, 1:social pictures");
            table.tinyint('position', 4).comment("we are managing here the image position for drag and drop concept");
            table.timestamps();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropSchema('crave_users_pictures');

};