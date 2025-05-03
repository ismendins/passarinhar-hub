const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv').config();

const url = process.env.URL;
const apikey = process.env.APIKEY;

const supabase = createClient(url, apikey);

module.exports = { supabase };