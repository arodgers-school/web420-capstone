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

// Create a team

/**
 * createTeam
 * @openapi
 * /api/teams:
 *   post:
 *     tags:
 *       - Teams
 *     name: createTeam
 *     description: API for creating a new team
 *     summary: Creates a new team document
 *     requestBody:
 *       description: Team information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - name
 *               - mascot
 *             properties:
 *               name:
 *                 type: string
 *               mascot:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Team added
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.post("/teams", async (req, res) => {
  try {
    const newTeam = {
      name: req.body.name,
      mascot: req.body.mascot,
    };

    await Team.create(newTeam, function (err, team) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else {
        console.log(team);
        res.json(team);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: `Server Exception: ${e.message}`,
    });
  }
});

// Find All

/**
 * findAllTeams
 * @openapi
 * /api/teams:
 *   get:
 *     tags:
 *       - Teams
 *     name: findAllTeams
 *     description: API for returning an array of team documents
 *     summary: Return an array of team documents
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
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Team ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Team information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - firstName
 *               - lastName
 *               - salary
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               salary:
 *                 type: number
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
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      salary: req.body.salary,
    };
    Team.findOne({ _id: req.params.id }, function (err, team) {
      if (err) {
        console.log(err);
        res.status(501).send({
          message: `MongoDB Exception: ${err}`,
        });
      } else if (!team) {
        res.status(401).send({
          message: `Invalid teamId: ${req.params.id}`,
        });
      } else {
        team.players.push(newPlayer);
        Team.update(team, function (error, updatedTeam) {
          if (err) {
            console.log(err);
            res.status(501).send({
              message: `MongoDB Exception: ${err}`,
            });
          } else {
            console.log(team);
            res.json(team);
          }
        });
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
 *     summary: Returns a team document
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
    Team.findOne({ _id: req.params.id }, function (err, team) {
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

/**
 * deleteTeamById
 * @openapi
 * /api/teams/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     name: deleteTeamById
 *     description: API for deleting a document.
 *     summary: Removes a team document by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the document
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Team document
 *       '401':
 *         description: Invalid teamID
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.delete("/teams/:id", async (req, res) => {
  try {
    Team.findByIdAndDelete({ _id: req.params.id }, function (err, team) {
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
        res.json(team);
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
