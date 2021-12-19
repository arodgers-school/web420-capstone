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
var express = require("express");
var router = express.Router();

var Team = require("../models/rodgers-team");

/**
 * findAllTeams
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Team
 *     description: Array of team documents
 *     responses:
 *       '200':
 *         description: Array of team documents
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.get("/teams", async (req, res) => {
  try {
    Team.find({}, function (err, teams) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        res.json(teams);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

module.exports = router;
