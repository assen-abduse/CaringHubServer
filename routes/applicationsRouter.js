const express = require('express')
const Applications = require('../models/applications')
const applicationsRouter = express.Router()
const auth = require('./auth')
applicationsRouter.use(express.json())

applicationsRouter.route('/')
  .get((req, res, next) => {
    Applications.find({})
      .populate('volunteer')
      .populate('project')
      .then((apps) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(apps)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .post(auth.verifyVol, (req, res, next) => {
    Applications.findOne(
      {
        volunteer: req.user._id,
        project: req.body.project
      }, (err, app) => {
        if(app) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.json({errMess: 'Application Already Exists!'})
        }
        if(err) {
          next(err)
        }
        else {
          Applications.create({
            volunteer: req.user._id,
            project: req.body.project
          })
            .then((app) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json({app: app, status:'Success'})
            }, (err) => next(err))
            .catch((err) => next(err))
        }

      }
    )
  })


  .delete((req, res, next) => {
    Applications.remove({})
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

applicationsRouter.route('/:appId')
  .get((req, res, next) => {
    Applications.findById(req.params.appId)
      .then((app) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(app)
      }, (err) => next(err))
      .catch((err) => next(err))
  })


  .put((req, res, next) => {
    Applications.findByIdAndUpdate(req.params.appId, {
      $set: req.body
    }, { new: true })
      .then((app) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(app)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

  .delete((req, res, next) => {
    Applications.findByIdAndRemove(req.params.appId)
      .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = applicationsRouter
