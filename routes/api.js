"use strict";

const { doesNotMatch } = require("assert");
const crypto = require("crypto");

module.exports = function (app) {
  const projects = {
    "5871dda29faedc3491ff93bb": [
      {
        assigned_to: "",
        status_text: "",
        open: false,
        _id: "6343672922f8280a3ab60eda",
        issue_title: "T",
        issue_text: "Test",
        created_by: "sammy",
        created_on: "2022-10-10T00:28:25.845Z",
        updated_on: "2024-11-29T06:47:10.771Z",
      },
      {
        assigned_to: "",
        status_text: "",
        open: true,
        _id: "6666d5d806f45900138d527c",
        issue_title: "a",
        issue_text: "a",
        created_by: "a",
        created_on: "2024-06-10T10:30:48.079Z",
        updated_on: "2024-06-10T10:30:48.079Z",
      },
      {
        assigned_to: "",
        status_text: "",
        open: false,
        _id: "667bef5608f025001375a4f8",
        issue_title: "1",
        issue_text: "1",
        created_by: "1",
        created_on: "2024-06-26T10:37:10.026Z",
        updated_on: "2024-06-26T10:37:16.409Z",
      },
      {
        assigned_to: "",
        status_text: "",
        open: true,
        _id: "67496364fd34e80013723839",
        issue_title: "My first issue",
        issue_text: "123",
        created_by: "Ed",
        created_on: "2024-11-29T06:47:00.724Z",
        updated_on: "2024-11-29T06:47:00.724Z",
      },
    ],
    edwinwin: [
      {
        assigned_to: "",
        status_text: "",
        open: true,
        _id: "674969a4fd34e8001372384a",
        issue_title: "My first issue",
        issue_text: "123123",
        created_by: "edwinwin",
        created_on: "2024-11-29T07:13:40.640Z",
        updated_on: "2024-11-29T07:13:40.640Z",
      },
      {
        assigned_to: "edwinwin",
        status_text: "test",
        open: false,
        _id: "67496a12fd34e8001372384e",
        issue_title: "My second issue",
        issue_text: "123123",
        created_by: "edwinwin",
        created_on: "2024-11-29T07:15:30.042Z",
        updated_on: "2024-11-29T07:15:30.042Z",
      },
    ],
  };

  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      const project = req.params.project;
      let filtered = [...projects[project]];
      const query = req.query;

      if (!Object.keys(query).length) {
        return res.send(filtered);
      }
      
      if (query.open) {
        query.open = query.open == "true";
      }

      filtered = filtered.filter((issue) =>
        Object.keys(query).every((key) => issue[key] == query[key])
      );

      return res.send(filtered);
    })

    .post(function (req, res) {
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.send({ error: "required field(s) missing" });
      }

      const projectid = req.params.project;
      const datestring = new Date().toISOString();
      const id = crypto.randomBytes(12).toString("hex");

      const newIssue = {
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        open: true,
        _id: id,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: datestring,
        updated_on: datestring,
      };

      if (!Array.isArray(projects[projectid])) {
        projects[projectid] = [];
        projects[projectid].push(newIssue);
        return res.send(newIssue);
      }

      projects[projectid].push(newIssue);
      return res.send(newIssue);
    })

    .put(function (req, res) {
      const projectid = req.params.project;
      const { _id: id, ...updates } = req.body;

      if (!req.body._id) {
        return res.send({ error: "missing _id" });
      }

      if (Object.keys(updates).length === 0) {
        return res.send({ error: "no update field(s) sent", _id: id });
      }

      try {
        const issueIndex = projects[projectid].findIndex(
          (issue) => issue._id === id
        );

        for (let key in updates) {
          projects[projectid][issueIndex][key] = updates[key];
        }

        const updateTimestamp = new Date().toISOString();
        projects[projectid][issueIndex].updated_on = updateTimestamp;

        res.send({
          result: "successfully updated",
          _id: id,
        });
      } catch (error) {
        res.send({ error: "could not update", _id: id });
      }
    })

    .delete(function (req, res) {
      const projectid = req.params.project;
      const id = req.body._id;

      if (!id) {
        return res.send({ error: "missing _id" });
      }

      const issueIndex = projects[projectid].findIndex(
        (issue) => issue._id === id
      );

      if (issueIndex === -1) {
        return res.send({ error: "could not delete", _id: id });
      }

      projects[projectid].splice(issueIndex, 1);
      res.send({ result: "successfully deleted", _id: id });
    });
};
