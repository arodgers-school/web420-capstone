/*
Title: 
Assignment 9.2 - Capstone
Author: Adam Rodgers
Date: 
  19 Dec 2021
Modified By: Adam Rodgers
Description: Team API (Capstone)
Resources:
  Bellevue University Github Repo
*/

// Set requires
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Build team schema
let teamSchema = new Schema({
  name: { type: String },
  mascot: { type: String },
  players: [playerSchema],
});

// Build player schema
let playerSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  salary: { type: Number },
});

// Export module
module.exports = mongoose.model("Team", teamSchema);
