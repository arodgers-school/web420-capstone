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

// Find All

/**
 * findAllTeams
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     description: API for returning an array of team documents
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

// Assign player to team

/**
 * assignPlayerToTeam
 * @openapi
 * /api/teams/{id}/players:
 *   post:
 *     tags:
 *       - Teams
 *     name: assignPlayerToTeam
 *     description: API for adding a new player to a team
 *     summary: Creates a player document
 *     requestBody:
 *       description: Team information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - id
 *               - firstName
 *               - lastName
 *               - salary
 *             properties:
 *               id:
 *                 id: string
 *                 firstName: string
 *                 lastName: string
 *                 salary: string
 *     responses:
 *       '200':
 *         description: Player document
 *       '401':
 *         description: Invalid teamID
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.post("/teams/:id/players", async (req, res) => {
  try {
    const newPlayer = {
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      salary: req.body.salary,
    };

    await Team.create(newPlayer, function (err, team) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else if (!team) {
        res.status(401).send({
          message: `Invalid teamID: ${req.params.id}`,
        });
      } else {
        res.json(team.player);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

// Find by Team ID

/**
 * findAllPlayersByTeamId
 * @openapi
 * /api/teams/{id}/players:
 *   get:
 *     tags:
 *       - Teams
 *     description: API for returning all players by team ID
 *     summary: returns a composer document
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team document id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of players documents
 *       '401':
 *         description: Invalid teamID
 *       '500':
 *         description: Server exception
 *       '501':
 *         description: MongoDB Exception
 */

router.get("/teams/:id/players", async (req, res) => {
  try {
    Composer.findOne({ _id: req.params.id }, function (err, team) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else if (!team) {
        res.status(401).send({
          message: `Invalid teamID: ${req.params.id}`,
        });
      } else {
        res.json(team.players);
      }
    });
  } catch (e) {
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

module.exports = router;
