
import { Train } from "../train/train"
import { Route, RouteRepository } from "./route"

const routes: { [trainId: string]: Route } = {
	'2323512': {
		displayName: "Ankara-İstanbul YHT",
		stations: [
			{
				stationId: "ANK",
				displayName: "Ankara Gar",
				distance: 0,
			}, {
				stationId: "ERY",
				displayName: "Eryaman YHT",
				distance: 20, // 16
			}, {
				stationId: "PLT",
				displayName: "Polatlı YHT",
				distance: 48,
			}, {
				stationId: "ESK",
				displayName: "Eskışehir",
				distance: 80,
			}, {
				stationId: "BUU",
				displayName: "Bozüyük YHT",
				distance: 100,
			}, {
				stationId: "BLC",
				displayName: "Bilecik YHT",
				distance: 130,
			}, {
				stationId: "AFI",
				displayName: "Arifiye YHT",
				distance: 175,
			}, {
				stationId: "IZT",
				displayName: "İzmit YHT",
				distance: 210,
			}, {
				stationId: "GBZ",
				displayName: "Gebze",
				distance: 245,
			}, {
				stationId: "IPE",
				displayName: "İstanbul (Pendik)",
				distance: 275,
			}, {
				stationId: "IBO",
				displayName: "İstanbul (Bostancı)",
				distance:295,
			}, {
				stationId: "ISC",
				displayName: "İstanbul (Söğüŧlüçeşme)",
				distance:310,
			}, {
				stationId: "IBA",
				displayName: "İstanbul (Bakırköy)",
				distance: 350,
			}, {
				stationId: "IHL",
				displayName: "İstanbul (Halkalı)",
				distance: 390,
			}
		]
	}
}

export default class MockRouteRepository implements RouteRepository {
	constructor() {}

	routeFor(train: Train): Route | null {
		if (train.id in routes) {
			return routes[train.id]
		} else return null
	}
}
