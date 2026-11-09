// LBZ specifications: docs/research/lbz.md. Illustrative substitutions: D4–D6.
const entry = {
  "id": "lbz",
  "family": "v8-ohv",
  "identity": {
    "name": "6.6L Duramax (RPO LBZ)",
    "shortName": "LBZ 6600",
    "code": "LBZ",
    "configuration": "90° V8",
    "years": "2006–2007 (VIN code D)",
    "accuracy": "rated-peaks",
    "assembly": "DMAX, Moraine, Ohio",
    "sceneName": "Duramax LBZ 6600"
  },
  "layout": {
    "banks": [
      {
        "id": "R",
        "rotationDeg": 45,
        "axisDeg": 135,
        "bankOffsetZmm": 30,
        "label": "Passenger (Right)"
      },
      {
        "id": "L",
        "rotationDeg": -45,
        "axisDeg": 45,
        "bankOffsetZmm": -30,
        "label": "Driver (Left)"
      }
    ],
    "stationZmm": [
      196,
      66,
      -66,
      -196
    ],
    "throwOffsetDeg": [
      0,
      90,
      270,
      180
    ],
    "cylinders": [
      {
        "number": 1,
        "bank": "R",
        "station": 0,
        "fireAngleDeg": 0
      },
      {
        "number": 2,
        "bank": "L",
        "station": 0,
        "fireAngleDeg": 90
      },
      {
        "number": 3,
        "bank": "R",
        "station": 1,
        "fireAngleDeg": 630
      },
      {
        "number": 4,
        "bank": "L",
        "station": 1,
        "fireAngleDeg": 360
      },
      {
        "number": 5,
        "bank": "R",
        "station": 2,
        "fireAngleDeg": 450
      },
      {
        "number": 6,
        "bank": "L",
        "station": 2,
        "fireAngleDeg": 540
      },
      {
        "number": 7,
        "bank": "R",
        "station": 3,
        "fireAngleDeg": 180
      },
      {
        "number": 8,
        "bank": "L",
        "station": 3,
        "fireAngleDeg": 270
      }
    ],
    "firingOrder": [
      1,
      2,
      7,
      8,
      4,
      5,
      6,
      3
    ]
  },
  "geometry": {
    "displacementCc": 6599,
    "displacementCid": 402.69568728113836,
    "boreMm": 103,
    "strokeMm": 99,
    "crankRadiusMm": 49.5,
    "rodLengthMm": 163,
    "boreStrokeRatio": 1.04,
    "compressionRatio": "16.8:1",
    "envelopeIn": [
      30,
      30,
      32
    ],
    "massLb": 835
  },
  "valvetrain": {
    "type": "ohv",
    "valvesPerCylinder": 4,
    "totalValves": 32,
    "timing": {
      "intake": {
        "centerDeg": 450,
        "durationDeg": 230,
        "liftMm": 10.9
      },
      "exhaust": {
        "centerDeg": 270,
        "durationDeg": 224,
        "liftMm": 10.4
      }
    }
  },
  "features": {
    "ignition": "glow",
    "injection": "common-rail",
    "cp3": true,
    "turbo": "vgt",
    "egr": true,
    "oxidationCatalyst": true,
    "glowPlugs": 8,
    "intakeAirHeater": true
  },
  "ratings": {
    "idleRpm": 680,
    "redlineRpm": 3250,
    "peakTorqueRpm": 1600,
    "peakPowerRpm": 3200,
    "peakTorqueLbFt": 650,
    "peakHp": 360,
    "calibrations": {
      "allison": {
        "id": "allison",
        "label": "Allison 1000 automatic (Silverado and Sierra HD)",
        "shortLabel": "SILVERADO / SIERRA HD",
        "modelYears": "2006–2007",
        "peakTorqueLbFt": 650,
        "peakTorqueRpm": 1600,
        "peakHp": 360,
        "peakPowerRpm": 3200,
        "maxRailPsi": 26000,
        "compressionRatio": "16.8:1"
      },
      "kodiak": {
        "id": "kodiak",
        "label": "Allison 1000 automatic (Kodiak and TopKick, LPD option)",
        "shortLabel": "KODIAK / TOPKICK LPD",
        "modelYears": "2006–2007",
        "peakTorqueLbFt": 605,
        "peakTorqueRpm": 1600,
        "peakHp": 310,
        "peakPowerRpm": 3000,
        "maxRailPsi": 26000,
        "compressionRatio": "16.8:1"
      }
    },
    "presets": [
      {
        "rpm": 0,
        "label": "STOP"
      },
      {
        "rpm": 680,
        "label": "WARM IDLE",
        "toast": "WARM IDLE"
      },
      {
        "rpm": 1600,
        "label": "PEAK TQ",
        "toast": "PEAK TORQUE"
      },
      {
        "rpm": 3200,
        "label": "PEAK HP",
        "toast": "PEAK HORSEPOWER"
      },
      {
        "rpm": 3250,
        "label": "GOVERNOR",
        "toast": "GOVERNED REDLINE"
      }
    ],
    "defaultCalibration": "allison"
  },
  "curves": {
    "torque": {
      "interp": "smoothstep",
      "zeroBelowRpm": 40,
      "points": {
        "allison": [
          [
            0,
            0
          ],
          [
            400,
            260
          ],
          [
            680,
            454.99999999999994
          ],
          [
            1200,
            617.5
          ],
          [
            1600,
            650
          ],
          [
            2200,
            630.5
          ],
          [
            3200,
            590.85
          ],
          [
            3250,
            579.033
          ]
        ],
        "kodiak": [
          [
            0,
            0
          ],
          [
            400,
            242
          ],
          [
            680,
            423.5
          ],
          [
            1200,
            574.75
          ],
          [
            1600,
            605
          ],
          [
            2200,
            586.85
          ],
          [
            3000,
            542.7066666666667
          ],
          [
            3250,
            531.8525333333333
          ]
        ]
      }
    },
    "rail": {
      "interp": "smoothstep",
      "zeroBelowRpm": 25,
      "scaleTo": 26000,
      "points": [
        [
          0,
          0
        ],
        [
          250,
          4400
        ],
        [
          680,
          7100
        ],
        [
          1000,
          12400
        ],
        [
          1600,
          19800
        ],
        [
          2200,
          23800
        ],
        [
          3000,
          25900
        ],
        [
          3250,
          26000
        ]
      ]
    },
    "boost": {
      "interp": "smoothstep",
      "zeroBelowRpm": 120,
      "capPsi": 30,
      "points": [
        [
          120,
          0
        ],
        [
          680,
          0.782608695652174
        ],
        [
          1000,
          5.739130434782608
        ],
        [
          1300,
          14.608695652173912
        ],
        [
          1600,
          22.17391304347826
        ],
        [
          2000,
          26.347826086956523
        ],
        [
          2600,
          28.956521739130434
        ],
        [
          3000,
          30
        ],
        [
          3250,
          28.17391304347826
        ]
      ]
    },
    "vane": {
      "interp": "linear",
      "zeroBelowRpm": 30,
      "round": true,
      "points": [
        [
          500,
          82
        ],
        [
          680,
          78
        ],
        [
          1000,
          65
        ],
        [
          1600,
          47
        ],
        [
          2200,
          34
        ],
        [
          3000,
          22
        ],
        [
          3250,
          20
        ]
      ]
    },
    "egt": {
      "formula": "power",
      "base": 232,
      "span": 510,
      "exponent": 0.72,
      "atRpm": 3250,
      "round": true,
      "belowRpm": 30,
      "belowValue": 38
    },
    "oil": {
      "formula": "linear",
      "base": 22,
      "span": 38,
      "atRpm": 1800,
      "round": true,
      "zeroBelowRpm": 20
    },
    "coolant": {
      "formula": "linear",
      "base": 88,
      "span": 4,
      "atRpm": 3250,
      "round": true
    }
  },
  "turbo": {
    "model": "Garrett GT3788VA VVT",
    "compressorInducerMm": 60.5,
    "compressorExducerMm": 87.9,
    "compressorBlades": 11,
    "turbineInducerMm": 72.2,
    "turbineExducerMm": 63.2,
    "turbineBlades": 13,
    "vaneHeightMm": 12.63,
    "boostPeakPsi": 30
  },
  "telemetry": {
    "gates": {
      "torqueHpMinRpm": 150,
      "vaneMinRpm": 30,
      "coolantMinRpm": 50,
      "railRequiresFiring": true,
      "boostRequiresFiring": true,
      "oilRequiresFiring": true,
      "egtRequiresFiring": true
    },
    "notFiring": {
      "egtBase": 38,
      "egtPerRpm": 0.02,
      "coolant": 38
    }
  },
  "startSequence": {
    "crankRpm": 190,
    "crankDamping": 4.7,
    "crankUntilS": 0.55,
    "lightOffRpm": 520,
    "lightOffDamping": 3.1,
    "lightOffUntilS": 1.25,
    "idleDamping": 2.2,
    "idleUntilS": 2.05,
    "rampEndS": 2.25,
    "rampDamping": {
      "aboveRpm": 1600,
      "fast": 1.08,
      "slow": 1.35
    },
    "runDamping": {
      "aboveRpm": 2200,
      "fast": 0.98,
      "slow": 1.42
    },
    "stopDamping": 1.05,
    "stopSnapRpm": 3.5,
    "firingAboveRpm": 90,
    "overspeedDamping": 6,
    "overspeedHeadroomRpm": 12,
    "glow": {
      "onStart": 0.85,
      "crank": {
        "target": 1,
        "damping": 6
      },
      "lightOff": {
        "target": 0.55,
        "damping": 4
      },
      "idle": {
        "target": 0.12,
        "damping": 2.4
      },
      "ramp": {
        "target": 0,
        "damping": 2.8
      },
      "running": {
        "target": 0,
        "damping": 3
      },
      "stopped": {
        "damping": 1.5,
        "cutoff": 0.001
      }
    }
  },
  "audio": {
    "baseToneHz": 45.3,
    "maxFrameS": 0.2,
    "firingAboveRpm": 80,
    "pulsesPerRev": 4,
    "bankCadence": true,
    "turboWhistle": true,
    "injectorKnock": true
  },
  "inspect": {
    "quickParts": [
      "turbo",
      "valvetrain",
      "cp3",
      "block"
    ],
    "aliases": {
      "valvetrain": [
        "camshaft",
        "lifters",
        "pushrods",
        "rockers",
        "valve-bridges",
        "valves"
      ]
    }
  },
  "walk": {
    "clearanceRadiusM": 1.03,
    "wallClearanceM": 0.35,
    "dynoClearanceM": 0.3,
    "maxHopM": 0.1
  },
  "dyno": {
    "ratedLbFt": 1000,
    "maxRpm": 4000
  },
  "look": {
    "palette": {
      "block": 2896174,
      "head": 11712691,
      "blockDark": 2106402,
      "cover": 1711900,
      "liner": 5987929,
      "frontCover": 8949642,
      "intake": 9541522,
      "oilFilterCap": 1789296,
      "turboScreen": 2435880
    },
    "effects": {
      "combustionGlow": 16751429,
      "injectorGlow": 16757327
    },
    "decals": {
      "block": [
        {
          "text": "GM POWERTRAIN",
          "font": "700 92px Bahnschrift, Arial, sans-serif",
          "color": "#211f1a"
        },
        {
          "text": "DURAMAX 6600  ·  LBZ",
          "font": "600 48px Bahnschrift, Arial, sans-serif",
          "color": "#2b2924",
          "small": true
        }
      ],
      "serialPlate": [
        {
          "text": "DMAX-MORAINE",
          "font": "700 74px Bahnschrift, Arial",
          "color": "#d6c191"
        },
        {
          "text": "LBZ 6600  /  SER. 04-661842",
          "font": "500 32px Consolas, monospace",
          "color": "#b7a786",
          "small": true
        }
      ],
      "timingCover": [
        {
          "text": "TDC    0°   10°   20°",
          "font": "600 42px Consolas, monospace",
          "color": "#f0e1b2"
        }
      ],
      "head": [
        {
          "text": "DMAX",
          "font": "800 96px Bahnschrift, Arial",
          "color": "#4c4d48"
        }
      ],
      "injectors": [
        {
          "text": "BOSCH",
          "font": "700 64px Bahnschrift, Arial",
          "color": "#d8d4c5"
        },
        {
          "text": "CRIN · LBZ",
          "font": "500 28px Consolas, monospace",
          "color": "#9d998b",
          "small": true
        }
      ],
      "valveCover": [
        {
          "text": "DURAMAX",
          "font": "800 202px Bahnschrift, Arial, sans-serif",
          "color": "#1c211e"
        },
        {
          "text": "LBZ 6600  ·  32V OHV",
          "font": "600 44px Bahnschrift, Arial",
          "color": "#8d5717",
          "small": true
        }
      ],
      "coverCaution": [
        {
          "text": "WARNING",
          "font": "800 74px Bahnschrift, Arial",
          "color": "#c9b47a"
        },
        {
          "text": "HOT SURFACE  ·  DO NOT OPEN WHEN RUNNING",
          "font": "500 24px Bahnschrift",
          "color": "#cfcab8",
          "small": true
        }
      ],
      "oilPan": [
        {
          "text": "DMAX",
          "font": "800 105px Bahnschrift, Arial",
          "color": "#99998d"
        },
        {
          "text": "10 QT  ·  ENGINE OIL",
          "font": "600 38px Bahnschrift, Arial",
          "color": "#8b8b80",
          "small": true
        }
      ],
      "oilFilter": [
        {
          "text": "ACDelco",
          "font": "800 126px Georgia, serif",
          "color": "#f1f0e8"
        },
        {
          "text": "PF2232",
          "font": "700 92px Bahnschrift, Arial",
          "color": "#ffb24d"
        },
        {
          "text": "HIGH EFFICIENCY  ·  FULL FLOW",
          "font": "600 27px Bahnschrift, Arial",
          "color": "#c5d6d8",
          "small": true
        }
      ],
      "oilFilterPlate": [
        {
          "text": "PF2232",
          "font": "700 74px Bahnschrift, Arial",
          "color": "#d2b06a"
        },
        {
          "text": "ACDelco",
          "font": "500 32px Georgia, serif",
          "color": "#d9d5c8",
          "small": true
        }
      ],
      "alternator": [
        {
          "text": "DELCO REMY",
          "font": "700 58px Bahnschrift, Arial",
          "color": "#30332f"
        }
      ],
      "exhaustManifold": [
        {
          "text": "DMAX",
          "font": "900 130px Bahnschrift, Arial",
          "color": "#efe6d4"
        },
        {
          "text": "LBZ 6600  ·  DIESEL",
          "font": "600 32px Bahnschrift, Arial",
          "color": "#d8a14b",
          "small": true
        }
      ],
      "exhaustShield": [
        {
          "text": "LBZ",
          "font": "800 107px Bahnschrift, Arial",
          "color": "#2d302d"
        },
        {
          "text": "EXHAUST  ·  Si-Mo",
          "font": "600 27px Bahnschrift",
          "color": "#50534e",
          "small": true
        }
      ],
      "turboPlaque": [
        {
          "text": "GARRETT",
          "font": "800 106px Bahnschrift, Arial",
          "color": "#ece7da"
        },
        {
          "text": "GT3788VA  ·  VVT",
          "font": "600 36px Bahnschrift, Arial",
          "color": "#d5a54c",
          "small": true
        }
      ],
      "turboIdPlate": [
        {
          "text": "GARRETT",
          "font": "800 93px Bahnschrift, Arial",
          "color": "#222522"
        },
        {
          "text": "GT3788VA  ·  VVT",
          "font": "700 37px Bahnschrift, Arial",
          "color": "#30342f",
          "small": true
        }
      ],
      "turboBosch": [
        {
          "text": "BOSCH",
          "font": "700 82px Bahnschrift",
          "color": "#e0e3df"
        }
      ],
      "intake": [
        {
          "text": "DURAMAX",
          "font": "800 168px Bahnschrift, Arial",
          "color": "#eee6d4"
        },
        {
          "text": "LBZ INTAKE  ·  6.6L",
          "font": "600 45px Bahnschrift, Arial",
          "color": "#dca344",
          "small": true
        }
      ],
      "chargePipe": [
        {
          "text": "CHARGE AIR",
          "font": "700 44px Bahnschrift",
          "color": "#e8ebe6"
        },
        {
          "text": "INTERCOOLED",
          "font": "500 23px Bahnschrift",
          "color": "#8a9691",
          "small": true
        }
      ],
      "egr": [
        {
          "text": "EGR",
          "font": "800 86px Bahnschrift",
          "color": "#e2dfd2"
        }
      ],
      "egrCooler": [
        {
          "text": "COOLED EGR",
          "font": "800 62px Bahnschrift",
          "color": "#343833"
        },
        {
          "text": "STAINLESS · LBZ",
          "font": "600 25px Bahnschrift",
          "color": "#585c55",
          "small": true
        }
      ],
      "cp3": [
        {
          "text": "BOSCH",
          "font": "800 107px Bahnschrift, Arial",
          "color": "#232622"
        },
        {
          "text": "CP3.3  ·  HIGH PRESSURE",
          "font": "600 30px Bahnschrift",
          "color": "#3a3e39",
          "small": true
        }
      ],
      "cp3Top": [
        {
          "text": "CP3.3  ·  BOSCH",
          "font": "700 57px Bahnschrift, Arial",
          "color": "#e8e5d8"
        }
      ],
      "fuelRail": [
        {
          "text": "BOSCH",
          "font": "700 64px Bahnschrift",
          "color": "#e6e5da"
        },
        {
          "text": "COMMON RAIL · 26K PSI",
          "font": "600 23px Bahnschrift",
          "color": "#b8b9ac",
          "small": true
        }
      ]
    },
    "bankLabels": {
      "head": {
        "R": {
          "text": "RIGHT BANK · 1-3-5-7",
          "font": "600 34px Bahnschrift, Arial",
          "color": "#52534e",
          "small": true
        },
        "L": {
          "text": "LEFT BANK · 2-4-6-8",
          "font": "600 34px Bahnschrift, Arial",
          "color": "#52534e",
          "small": true
        }
      },
      "bank": {
        "R": {
          "text": "BANK R  ·  1-3-5-7",
          "font": "700 75px Bahnschrift, Arial",
          "color": "#1c211e"
        },
        "L": {
          "text": "BANK L  ·  2-4-6-8",
          "font": "700 75px Bahnschrift, Arial",
          "color": "#1c211e"
        }
      },
      "side": {
        "R": {
          "text": "PASSENGER BANK",
          "font": "500 28px Bahnschrift, Arial",
          "color": "#82521a",
          "small": true
        },
        "L": {
          "text": "DRIVER BANK",
          "font": "500 28px Bahnschrift, Arial",
          "color": "#82521a",
          "small": true
        }
      }
    },
    "labelStyles": {
      "capNumeral": {
        "font": "700 98px Bahnschrift, Arial",
        "color": "#b5aa8a"
      },
      "valveIndex": {
        "font": "700 88px Bahnschrift, Arial",
        "color": "#d9d3bb"
      },
      "rockerMark": {
        "font": "800 96px Bahnschrift, Arial",
        "color": "#2e312e"
      }
    },
    "outline": {
      "base": {
        "edgeColor": 15311677,
        "hiddenColor": 2103308,
        "edgeStrength": 4.5,
        "edgeGlow": 0.3,
        "edgeThickness": 1
      },
      "hover": {
        "edgeColor": 8831170,
        "hiddenColor": 927784,
        "edgeStrength": 3.1
      },
      "selected": {
        "edgeColor": 15311677,
        "hiddenColor": 3352337,
        "edgeStrength": 5.1
      }
    }
  },
  "explode": {
    "cutawayFraction": 0.45,
    "offsets": {
      "rotating": [
        0,
        -105,
        0
      ],
      "main-caps": [
        0,
        -225,
        0
      ],
      "camshaft": [
        0,
        95,
        0
      ],
      "head-R": [
        -195,
        195,
        0
      ],
      "head-L": [
        195,
        195,
        0
      ],
      "cover-R": [
        -335,
        335,
        0
      ],
      "cover-L": [
        335,
        335,
        0
      ],
      "exhaust-R": [
        -290,
        95,
        0
      ],
      "exhaust-L": [
        290,
        95,
        0
      ],
      "oil-pan": [
        0,
        -355,
        0
      ],
      "oil-filter": [
        230,
        -70,
        0
      ],
      "front-drive": [
        0,
        15,
        290
      ],
      "turbo": [
        0,
        310,
        -250
      ],
      "intake": [
        0,
        340,
        40
      ],
      "egr": [
        -230,
        260,
        -90
      ],
      "fuel": [
        0,
        220,
        110
      ]
    }
  },
  "oil": {
    "capacityUsQt": 10,
    "filter": "ACDelco PF2232"
  },
  "ui": {
    "title": "DMAX LBZ 6600 — Engine Test Cell",
    "description": "Interactive 6.6L Duramax LBZ 90-degree V8 turbodiesel engine on an industrial dynamometer test stand.",
    "canvasAria": "Interactive 3D Duramax LBZ engine simulation",
    "header": {
      "brandHtml": "DURAMAX<span>6600</span>",
      "brandSub": "LBZ  ·  DMAX MORAINE  ·  ENGINE TEST CELL",
      "category": "POWERTRAIN CONTROL",
      "title": "LBZ // RUN CELL",
      "spec": {
        "displacement": "6.6L V8",
        "layout": "90° OHV",
        "valves": "32 VALVE",
        "firingOrder": "1–2–7–8–4–5–6–3"
      },
      "firing": {
        "right": "1–3–5–7",
        "left": "2–4–6–8",
        "cycle": "720° CYCLE · 90° FIRING INTERVAL"
      }
    },
    "walk": {
      "engineLabel": "LBZ 6600"
    },
    "telemetry": {
      "boostTitle": "GT3788VA BOOST",
      "chartAxis": [
        "0",
        "800",
        "1600",
        "2400",
        "3250 RPM"
      ]
    },
    "calibration": {
      "pump": "CP3.3",
      "allison": {
        "button": "SILVERADO / SIERRA",
        "tipName": "Allison 1000 automatic · Silverado and Sierra HD"
      },
      "kodiak": {
        "button": "KODIAK / TOPKICK",
        "tipName": "Allison 1000 automatic · Kodiak and TopKick LPD"
      }
    },
    "quickParts": {
      "turbo": "TURBO",
      "valvetrain": "VALVETRAIN",
      "cp3": "CP3.3",
      "block": "BLOCK"
    },
    "display": {
      "tachRedBandRpm": 3000,
      "governedLabelRpm": 3200,
      "adaptiveToastMs": 3200
    },
    "toasts": {
      "audioOnline": "TEST CELL AUDIO ONLINE · V8 + GT3788VA SYNTH"
    },
    "capture": {
      "caption": "DMAX  //  LBZ 6600  ·  TEST CELL 04",
      "place": "MORAINE, OHIO  ·  ENGINE TEST CELL",
      "fileStem": "duramax-lbz-test-cell"
    },
    "branding": {
      "floorLabel": "DMAX  /  TEST CELL 04",
      "signMain": "DMAX LBZ",
      "signSub": "MORAINE ENGINE PLANT  ·  DYNO TEST CELL 04",
      "consoleHeader": "DMAX DYNO  //  CELL 04",
      "consoleFooter": "TEST CELL / MORAINE, OHIO",
      "standMain": "DMAX LBZ",
      "standSub": "HEAVY DUTY DYNO BEDPLATE  ·  1,000 LB-FT"
    },
    "gaugeFullScale": {
      "torque": 0.7692307692307693,
      "boost": 1,
      "rail": 1
    },
    "inspector": {
      "displacement": "6,599 cc",
      "boreStroke": "103 × 99 mm",
      "dryMass": "835 lb"
    },
    "help": {
      "eyebrow": "LBZ SIMULATION GUIDE",
      "footerLeft": "DMAX TEST CELL 04 · MORAINE, OHIO",
      "footerRight": "LBZ 6.6L / 402.70 CID"
    },
    "specSheet": {
      "title": "6.6L DURAMAX LBZ",
      "displacement": "6,599 cc / 402.70 CID (derived)",
      "configuration": "90° V8 · OHV · 32V",
      "boreStroke": "103.00 × 99.00 mm",
      "boreStrokeRatio": "1.04 : 1",
      "firingOrder": "1–2–7–8–4–5–6–3",
      "compression": "16.8:1",
      "peakTorque": "650 / 605 lb-ft @ 1,600",
      "peakPower": "360 hp @ 3,200 / 310 hp @ 3,000",
      "governedSpeed": "3,250 RPM",
      "oilCapacity": "10 US qt · PF2232",
      "dryMass": "≈ 835 lb",
      "envelope": "30 × 30 × 32 in",
      "footnote": "Research-backed rated peaks and dimensions; interpolation, timing, startup, sound and appearance are illustrative design values. Rod length 163.0 mm uses family listings (medium confidence), not an LBZ-specific measurement. Stock boost is contested. Visualisation only; not OEM service data."
    }
  },
  "provenance": {
    "identity": [
      "S03",
      "S05"
    ],
    "layout.banks": "design",
    "layout.stationZmm": "design",
    "layout.throwOffsetDeg": "design",
    "layout.cylinders": "design",
    "layout.firingOrder": [
      "S03"
    ],
    "geometry.displacementCc": [
      "S03",
      "S07"
    ],
    "geometry.displacementCid": {
      "ids": [
        "S03"
      ],
      "status": "derived",
      "note": "6599 cc divided by 16.387064 cc per cubic inch"
    },
    "geometry.boreMm": [
      "S03"
    ],
    "geometry.strokeMm": [
      "S03"
    ],
    "geometry.crankRadiusMm": {
      "ids": [
        "S03"
      ],
      "status": "derived"
    },
    "geometry.rodLengthMm": {
      "ids": [
        "S13",
        "S14"
      ],
      "status": "sourced",
      "confidence": "medium",
      "note": "D4: family listings; LBZ-specific rod length not independently established"
    },
    "geometry.boreStrokeRatio": [
      "S03"
    ],
    "geometry.envelopeIn": [
      "S03"
    ],
    "geometry.massLb": {
      "ids": [
        "S03"
      ],
      "status": "sourced",
      "confidence": "medium",
      "note": "Approximate; dry/wet not established"
    },
    "geometry.compressionRatio": [
      "S03",
      "S05",
      "S07",
      "S08"
    ],
    "valvetrain.valvesPerCylinder": [
      "S03",
      "S05"
    ],
    "valvetrain.totalValves": [
      "S03",
      "S05"
    ],
    "valvetrain.timing": {
      "label": "design",
      "note": "D5: retained illustrative LLY timing, not measured LBZ timing"
    },
    "features": "design",
    "features.glowPlugs": [
      "S03"
    ],
    "features.intakeAirHeater": [
      "S02"
    ],
    "ratings.idleRpm": {
      "ids": [
        "S03"
      ],
      "confidence": "medium"
    },
    "ratings.redlineRpm": {
      "ids": [
        "S08"
      ],
      "status": "conflict",
      "note": "D4 research reading: 3250; S03 gives a higher range"
    },
    "ratings.peakTorqueLbFt": [
      "S03",
      "S05",
      "S08"
    ],
    "ratings.peakTorqueRpm": [
      "S03",
      "S05",
      "S08"
    ],
    "ratings.peakHp": [
      "S03",
      "S05",
      "S08"
    ],
    "ratings.peakPowerRpm": [
      "S03",
      "S05",
      "S08"
    ],
    "ratings.calibrations.allison": [
      "S03",
      "S05",
      "S07",
      "S08"
    ],
    "ratings.calibrations.kodiak": [
      "S03",
      "S07"
    ],
    "ratings.calibrations.kodiak.maxRailPsi": {
      "ids": [
        "S03",
        "S05"
      ],
      "note": "Engine-level maximum; LPD pressure not separately stated"
    },
    "ratings.presets": "design",
    "curves": "design",
    "curves.boost.capPsi": {
      "ids": [
        "S06",
        "S23"
      ],
      "status": "contested",
      "label": "design",
      "note": "Table 30 psi conflicts with anecdotal 17–20 psi; curve is illustrative"
    },
    "turbo": [
      "S06"
    ],
    "turbo.boostPeakPsi": {
      "ids": [
        "S06",
        "S23"
      ],
      "status": "contested"
    },
    "telemetry": "design",
    "startSequence": "design",
    "audio": "design",
    "walk": "design",
    "dyno": "design",
    "look": "design",
    "explode": "design",
    "ui": "design",
    "oil.capacityUsQt": [
      "S02"
    ],
    "oil.filter": [
      "S02"
    ]
  }
};

entry.copy = () => import('./copy.js');
export default entry;
