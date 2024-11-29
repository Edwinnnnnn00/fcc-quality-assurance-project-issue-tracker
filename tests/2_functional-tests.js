const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/test")
      .send({
        issue_title: "Test title",
        issue_text: "Test text",
        created_by: "Functional Test 1",
        assigned_to: "Chai and Mocha",
        status_text: "In QA",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Test title");
        assert.equal(res.body.issue_text, "Test text");
        assert.equal(res.body.created_by, "Functional Test 1");
        assert.equal(res.body.assigned_to, "Chai and Mocha");
        assert.equal(res.body.status_text, "In QA");
        done();
      });
  });

  test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/test")
      .send({
        issue_title: "Test title",
        issue_text: "Test text",
        created_by: "Functional Test 2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Test title");
        assert.equal(res.body.issue_text, "Test text");
        assert.equal(res.body.created_by, "Functional Test 2");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        done();
      });
  });

  test("Create an issue with no required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/test")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  test("View issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/edwinwin")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.deepEqual(res.body, [
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
        ]);
        done();
      });
  });

  test("View issues on a project with one filter: GET request to /api/issues/{project}?open=true", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/edwinwin?open=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.deepEqual(res.body, [
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
        ]);
        done();
      });
  });

  test("View issues on a project with multiple filters: GET request to /api/issues/{project}?open=true&created_by=Functional Test", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/edwinwin?open=false&created_by=edwinwin")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.deepEqual(res.body, [
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
        ]);
        done();
      });
  });

  test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/edwinwin")
      .send({ _id: "674969a4fd34e8001372384a", open: false })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "674969a4fd34e8001372384a");
        done();
      });
  });

  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/edwinwin")
      .send({
        _id: "674969a4fd34e8001372384a",
        open: false,
        assigned_to: "edwinwin",
        status_text: "test",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "674969a4fd34e8001372384a");
        done();
      });
  });

  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/edwinwin")
      .send({
        open: false,
        assigned_to: "edwinwin",
        status_text: "test",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/edwinwin")
      .send({
        _id: "674969a4fd34e8001372384a",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent");
        assert.equal(res.body._id, "674969a4fd34e8001372384a");
        done();
      });
  });

  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/edwinwin")
      .send({
        _id: "invalid",
        open: false,
        assigned_to: "edwinwin",
        status_text: "test",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "invalid");
        done();
      });
  }); 

  test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/edwinwin")
      .send({ _id: "67496a12fd34e8001372384e" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, "67496a12fd34e8001372384e");
        done();
      });
  });

  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/edwinwin")
      .send({ _id: "invalid" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "invalid");
        done();
      });
  });

  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/edwinwin")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
