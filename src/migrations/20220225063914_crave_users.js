/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('crave_users', function(table) {
            table.increments('id');
            table.string('email', 50);
            table.unique('email');
            table.string('username', 20);
            table.unique('username');
            table.string('password', 100);
            table.tinyint('profile_step', 4).comment("1= your profile type, 2 = create your profile");
            table.integer('profile_type', 11).unsigned().comment("crave_profile_types table promary key");
            table.foreign('profile_type').references('id').inTable('crave_profile_types');
            table.tinyint('is_crave_plus', 4).defaultTo('1').comment("1:crave user, 2:crave plus user");
            table.tinyint('signup_by', 4).comment("1:Normal, 2:Social");
            table.text('description').comment("1:Normal, 2:Social");
            table.tinyint('is_filter_on', 4).defaultTo('0').comment("0: craving filter not apply, 1:craving filter apply");
            table.tinyint('is_visible', 4).defaultTo('1').comment("0: not visible, 1:visible");
            table.text('device_token').comment("its comes from firbase token for notification");
            table.string('device_id', 100).comment("Uniques device id");
            table.unique('device_id');
            table.tinyint('device_type', 4).comment("1:Android,2:IOS, 3:Website");
            table.string('discover_radius', 4).defaultTo("160");
            table.tinyint('discover_unit', 4).defaultTo("1").comment("1:km, 2:miles");
            table.string('country', 20);
            table.string('initial_lat', 10);
            table.string('initial_long', 10);
            table.tinyint('status', 4).defaultTo("1").comment("1:active, 2:inactive, 3:deleted");


            table.timestamps();
        })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropSchema('crave_users');

};