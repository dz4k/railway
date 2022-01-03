"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var errors_1 = require("./core/errors");
var RailwayTracker = /** @class */ (function (_super) {
    __extends(RailwayTracker, _super);
    function RailwayTracker(ticketID, trains, routes, tickets) {
        var _this = _super.call(this) || this;
        _this.trains = trains;
        _this.routes = routes;
        _this.tickets = tickets;
        var ticket = _this.tickets.ticket(ticketID);
        if (ticket == null)
            throw new errors_1.NoTicket("No such ticket ".concat(ticketID));
        else
            _this.ticket = ticket;
        _this.train = { id: _this.ticket.train };
        var route = _this.routes.routeFor(_this.train);
        if (route == null)
            throw new errors_1.NoRoute("No route for train ".concat(_this.train.id));
        else
            _this.route = route;
        _this.track(function (t) {
            _this.dispatchEvent(Object.assign(new Event("report"), { detail: t }));
        });
        return _this;
    }
    RailwayTracker.prototype.track = function (cb) {
        var _this = this;
        var speed = 0;
        var predictiveSpeed = 0;
        var message = null;
        this.trains.subscribe(this.train, function (t) {
            var state = t.state;
            if (state.service === "canceled" || state.service === "delayed") {
                message = state.cause;
            }
            speed = t.speed;
            if (speed != 0)
                predictiveSpeed = speed;
            var stationsPast = [], stationAt = null, stationsAhead = [], from = null, to = null;
            for (var _i = 0, _a = _this.route.stations; _i < _a.length; _i++) {
                var station = _a[_i];
                if (station.stationId == _this.ticket.from) {
                    from = station;
                }
                if (station.stationId == _this.ticket.to) {
                    to = station;
                    break;
                }
                if (station.distance < t.lineTraveled)
                    stationsPast.push(station);
                else if (station.distance == t.lineTraveled)
                    stationAt = station;
                else
                    stationsAhead.push(station);
            }
            cb({
                eta: _this.eta(speed, t.lineTraveled, to.distance),
                speed: speed,
                stationAt: stationAt,
                stationsAhead: stationsAhead,
                stationsPast: stationsPast,
                message: message,
                from: from,
                to: to
            });
        }, function () {
            _this.dispatchEvent(new Event('closed'));
        });
    };
    RailwayTracker.prototype.eta = function (speed, from, to) {
        return ((to - from) / speed) * 60;
    };
    return RailwayTracker;
}(EventTarget));
exports["default"] = RailwayTracker;
