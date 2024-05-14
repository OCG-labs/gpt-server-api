import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch, { Headers } from 'node-fetch';
import fs from 'fs';
import { Buffer } from 'buffer';

dotenv.config(); // Initialize environment variables
let PORT = process.env.PORT || 4000; // Set port
const app = express(); // Initialize express

let OPENAI_API_KEY;

// Check if the Docker secret file exists
if (fs.existsSync('/etc/secrets/openai_api_key')) {
  // Read the API key from the Docker secret
  OPENAI_API_KEY = fs.readFileSync('/etc/secrets/openai_api_key', 'utf8').trim();
} else {
  // Log error
  console.log("No api key")
}

/////////////////////////////// Middleware ///////////////////////////////
app.use(
  express.json(),
  express.static('public'),
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

/////////////////////////////// API Routes ///////////////////////////////

// Test GET request
app.get('/api/test', async (req, res, next) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    res.status(200).send(data);
  }
  catch (err) {
    next(err);
  }
});

// Post request that returns a chat json object
app.post('/api/chat/article', async (req, res, next) => {
  let userMessage = req.body.message; // Get message from request body

  if (userMessage === "") {
    return res.status(400).send("Message cannot be empty");
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        response_format: { type: "json_object" },
        messages: [
          {
            "role": "system",
            "content": "json"
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json(); // Get JSON response
    const dataJson = data["choices"][0]["message"]["content"]; // Grab JSON string
    console.log(data);
    console.log(dataJson);
    res.json(JSON.parse(dataJson)); // Chat String output
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

// Post request to post article to wordpress
app.post('/api/chat/article/post', async (req, res, next) => {
  let username = 'ocgdev';
  let password = req.body.password;
  let apiUrl = `${req.body.url}/wp-json/wp/v2/posts`;
  let postObj = {
    "title": req.body.title,

    "content": `${req.body.content}`,

    "status": 'draft'
  }
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
      },
      body: JSON.stringify(postObj)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    res.json(postObj);
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

// Page Routes

app.post('/api/chat/post/contact', async (req, res, next) => {
  let openHours = req.body.openHours;
  let closedHours = req.body.closedHours;
  let address = req.body.address;
  let email = req.body.email;
  let primaryPhone = req.body.primaryPhone;
  let map = req.body.map;

  let contactPageJson = {
    "id": 0,
    "name": "root",
    "depth": 0,
    "children": [
      {
        "id": 161,
        "name": "ct_section",
        "options": {
          "ct_id": 161,
          "ct_parent": 0,
          "selector": "section-161-33",
          "original": {
            "image_type": "2",
            "attachment_size": "full",
            "container-padding-top": "0",
            "container-padding-bottom": "0",
            "container-padding-left": "0",
            "container-padding-right": "0",
            "section-width": "full-width",
            "height-unit": "vh",
            "height": "40"
          },
          "nicename": "Contact Hero\/Map",
          "activeselector": false
        },
        "depth": 1,
        "children": [
          {
            "id": 162,
            "name": "ct_code_block",
            "options": {
              "ct_id": 162,
              "ct_parent": 161,
              "selector": "code_block-162-33",
              "original": {
                "image_type": "2",
                "attachment_size": "full",
                "code-php": map,
                "width-unit": "%",
                "width": "100",
                "height-unit": "%",
                "height": "100"
              },
              "nicename": "Code Block (#162)",
              "activeselector": false
            },
            "depth": 2
          }
        ]
      },
      {
        "id": 73,
        "name": "ct_div_block",
        "options": {
          "ct_id": 73,
          "ct_parent": 0,
          "selector": "div_block-73-33",
          "nicename": "Section 1",
          "classes": [
            "w-full"
          ],
          "activeselector": false,
          "ct_depth": 1
        },
        "depth": 1,
        "children": [
          {
            "id": 138,
            "name": "ct_section",
            "options": {
              "ct_id": 138,
              "ct_parent": "73",
              "selector": "section-138-33",
              "original": {
                "image_type": "2",
                "attachment_size": "full",
                "container-padding-top": "0"
              },
              "nicename": "Section (#138)",
              "activeselector": false
            },
            "depth": 2,
            "children": [
              {
                "id": 139,
                "name": "ct_new_columns",
                "options": {
                  "ct_id": 139,
                  "ct_parent": 138,
                  "selector": "new_columns-139-33",
                  "original": {
                    "image_type": "2",
                    "attachment_size": "full"
                  },
                  "nicename": "Columns (#139)",
                  "activeselector": false
                },
                "depth": 3,
                "children": [
                  {
                    "id": 140,
                    "name": "ct_div_block",
                    "options": {
                      "ct_id": 140,
                      "ct_parent": 139,
                      "selector": "div_block-140-33",
                      "original": {
                        "image_type": "2",
                        "attachment_size": "full",
                        "width": "50",
                        "width-unit": "%",
                        "margin-top": "50",
                        "justify-content": "flex-start"
                      },
                      "nicename": "Div (#140)",
                      "activeselector": false
                    },
                    "depth": 3,
                    "children": [
                      {
                        "id": 165,
                        "name": "ct_div_block",
                        "options": {
                          "ct_id": 165,
                          "ct_parent": 140,
                          "selector": "div_block-165-33",
                          "original": {
                            "image_type": "2",
                            "attachment_size": "full"
                          },
                          "nicename": "Div (#165)",
                          "activeselector": false
                        },
                        "depth": 4,
                        "children": [
                          {
                            "id": 6,
                            "name": "ct_headline",
                            "options": {
                              "ct_id": 6,
                              "ct_parent": 165,
                              "selector": "headline-6-33",
                              "original": {
                                "tag": "h1",
                                "color": "var(--primary-hover-color)",
                                "text-align": "center"
                              },
                              "classes": [
                                "h3",
                                "mb-4",
                                "color-white"
                              ],
                              "nicename": "Heading",
                              "activeselector": false,
                              "ct_depth": false,
                              "ct_content": "Contact us"
                            },
                            "depth": 5
                          },
                          {
                            "id": 147,
                            "name": "ct_text_block",
                            "options": {
                              "ct_id": 147,
                              "ct_parent": 165,
                              "selector": "text_block-147-33",
                              "classes": [
                                "font-sm",
                                "font-medium",
                                "color-primary",
                                "uppercase",
                                "mb-4"
                              ],
                              "activeselector": false,
                              "ct_depth": false,
                              "nicename": "Text (#147)",
                              "ct_content": "Phone",
                              "original": {
                                "margin-bottom": "0"
                              }
                            },
                            "depth": 5
                          },
                          {
                            "id": 86,
                            "name": "ct_link_text",
                            "options": {
                              "ct_id": 86,
                              "ct_parent": 165,
                              "selector": "link_text-86-33",
                              "original": {
                                "url": primaryPhone,
                                "target": "",
                                "url_encoded": "true",
                                "font-size": "15",
                                "hover_color": "var(--secondary-hover-color)",
                                "margin-top": "9",
                                "margin-bottom": "9"
                              },
                              "classes": [
                                "font-semibold",
                                "color-paragraph"
                              ],
                              "nicename": "Text",
                              "activeselector": false,
                              "ct_depth": false,
                              "ct_content": primaryPhone,
                              "hover": {
                                "color": "var(--secondary-hover-color)"
                              }
                            },
                            "depth": 5
                          },
                          {
                            "id": 148,
                            "name": "ct_text_block",
                            "options": {
                              "ct_id": 148,
                              "ct_parent": 165,
                              "selector": "text_block-148-33",
                              "classes": [
                                "font-sm",
                                "font-medium",
                                "color-primary",
                                "uppercase",
                                "mb-4"
                              ],
                              "activeselector": false,
                              "ct_depth": false,
                              "nicename": "Text (#148)",
                              "ct_content": "E-MAIL",
                              "original": {
                                "margin-bottom": "0"
                              }
                            },
                            "depth": 5
                          },
                          {
                            "id": 123,
                            "name": "ct_link_text",
                            "options": {
                              "ct_id": 123,
                              "ct_parent": 165,
                              "selector": "link_text-123-33",
                              "original": {
                                "url": `mailto:${email}`,
                                "target": "",
                                "url_encoded": "true",
                                "font-size": "15",
                                "hover_color": "var(--secondary-hover-color)",
                                "margin-top": "9",
                                "margin-bottom": "9"
                              },
                              "classes": [
                                "font-semibold",
                                "color-paragraph"
                              ],
                              "nicename": "Text",
                              "activeselector": false,
                              "ct_depth": false,
                              "ct_content": email,
                              "hover": {
                                "color": "var(--secondary-hover-color)"
                              }
                            },
                            "depth": 5
                          },
                          {
                            "id": 88,
                            "name": "ct_text_block",
                            "options": {
                              "ct_id": 88,
                              "ct_parent": 165,
                              "selector": "text_block-88-33",
                              "classes": [
                                "font-sm",
                                "font-medium",
                                "color-primary",
                                "uppercase",
                                "mb-4"
                              ],
                              "activeselector": false,
                              "ct_depth": false,
                              "nicename": "Text (#88)",
                              "ct_content": "Address",
                              "original": {
                                "margin-bottom": "0"
                              }
                            },
                            "depth": 5
                          },
                          {
                            "id": 119,
                            "name": "ct_link_text",
                            "options": {
                              "ct_id": 119,
                              "ct_parent": 165,
                              "selector": "link_text-119-33",
                              "original": {
                                "url": "https:\/\/www.google.com\/maps\/place\/2750+Trail+Rider+Dr,+Reno,+NV+89521\/@39.4308176,-119.7114727,17z\/data=!3m1!4b1!4m5!3m4!1s0x8099143addf99ea1:0xdc95f28eb631f51a!8m2!3d39.4308135!4d-119.7092787",
                                "target": "",
                                "url_encoded": "true",
                                "font-size": "15",
                                "hover_color": "var(--secondary-hover-color)",
                                "margin-top": "9",
                                "margin-bottom": "9"
                              },
                              "classes": [
                                "font-semibold",
                                "color-paragraph"
                              ],
                              "nicename": "Text",
                              "activeselector": false,
                              "ct_depth": false,
                              "ct_content": address,
                              "hover": {
                                "color": "var(--secondary-hover-color)"
                              }
                            },
                            "depth": 5
                          },
                          {
                            "id": 129,
                            "name": "ct_text_block",
                            "options": {
                              "ct_id": 129,
                              "ct_parent": 165,
                              "selector": "text_block-129-33",
                              "classes": [
                                "font-sm",
                                "font-medium",
                                "color-primary",
                                "uppercase",
                                "mb-4"
                              ],
                              "activeselector": false,
                              "ct_depth": false,
                              "nicename": "Text (#129)",
                              "ct_content": "BUSINESS HOURS",
                              "original": {
                                "margin-bottom": "0"
                              }
                            },
                            "depth": 5
                          },
                          {
                            "id": 127,
                            "name": "ct_text_block",
                            "options": {
                              "ct_id": 127,
                              "ct_parent": 165,
                              "selector": "text_block-127-33",
                              "original": {
                                "image_type": "2",
                                "attachment_size": "full",
                                "font-size": "15",
                                "margin-top": "9"
                              },
                              "nicename": "Text (#127)",
                              "ct_content": openHours,
                              "activeselector": false,
                              "classes": [
                                "font-semibold"
                              ]
                            },
                            "depth": 5
                          },
                          {
                            "id": 137,
                            "name": "ct_text_block",
                            "options": {
                              "ct_id": 137,
                              "ct_parent": 165,
                              "selector": "text_block-137-33",
                              "original": {
                                "image_type": "2",
                                "attachment_size": "full",
                                "font-size": "15"
                              },
                              "nicename": "Text (#137)",
                              "ct_content": closedHours,
                              "activeselector": false,
                              "classes": [
                                "font-semibold"
                              ]
                            },
                            "depth": 5
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "id": 141,
                    "name": "ct_div_block",
                    "options": {
                      "ct_id": 141,
                      "ct_parent": 139,
                      "selector": "div_block-141-33",
                      "original": {
                        "image_type": "2",
                        "attachment_size": "full",
                        "width": "50.00",
                        "width-unit": "%"
                      },
                      "nicename": "Div (#141)",
                      "activeselector": false
                    },
                    "depth": 3,
                    "children": [
                      {
                        "id": 91,
                        "name": "ct_div_block",
                        "options": {
                          "ct_id": 91,
                          "ct_parent": 141,
                          "selector": "div_block-91-33",
                          "activeselector": false,
                          "nicename": "Contact form",
                          "ct_depth": "4",
                          "original": {
                            "background-color": "var(--secondary-alt-hover-color)",
                            "background-size": "manual",
                            "background-repeat": "no-repeat",
                            "background-size-height": "430",
                            "background-position-top-unit": "%",
                            "background-position-top": "100",
                            "background-position-left-unit": "%",
                            "background-position-left": "100",
                            "display": "block",
                            "margin-top": "-125",
                            "padding-top": "40",
                            "padding-left": "40",
                            "padding-right": "40",
                            "padding-bottom": "40",
                            "width-unit": "%",
                            "width": "100",
                            "border-radius": "15",
                            "box-shadow-color": "#606060",
                            "box-shadow-inset": "false",
                            "box-shadow-blur": "0",
                            "text-align": "left",
                            "align-items": "center"
                          },
                          "classes": [],
                          "media": {
                            "tablet": {
                              "original": {
                                "margin-top-unit": "px",
                                "margin-top": "0"
                              }
                            },
                            "page-width": {
                              "original": {
                                "margin-top": "-100"
                              }
                            },
                            "phone-landscape": {
                              "original": {
                                "padding-top": "25",
                                "padding-right": "25",
                                "padding-bottom": "25",
                                "padding-left": "25"
                              }
                            },
                            "phone-portrait": {
                              "original": {
                                "padding-top": "25"
                              }
                            }
                          }
                        },
                        "depth": 4,
                        "children": [
                          {
                            "id": 173,
                            "name": "ct_text_block",
                            "options": {
                              "ct_id": 173,
                              "ct_parent": 91,
                              "selector": "text_block-173-33",
                              "original": {
                                "font-size": "15",
                                "text-align": "center"
                              },
                              "nicename": "Text (#173)",
                              "ct_content": "Please contact us with any questions or concerns you may have, we're more than happy to help!",
                              "classes": [
                                "mb-6"
                              ],
                              "activeselector": "mb-6"
                            },
                            "depth": 5
                          },
                          {
                            "id": 38,
                            "name": "oxy-form_widget",
                            "options": {
                              "ct_id": 38,
                              "ct_parent": 91,
                              "selector": "-form_widget-38-33",
                              "original": {
                                "image_type": "2",
                                "attachment_size": "full",
                                "oxy-form_widget_ff_form": "3",
                                "oxy-form_widget_-fluentform -ff-el-input--label label_typography_text-align": "left",
                                "oxy-form_widget_slug_ffbtnsubmithover_background_color": "var(--primary-hover-color)",
                                "oxy-form_widget_slug_ffbtnsubmit_background_color": "var(--primary-hover-color)",
                                "oxy-form_widget_slug_ffbtnsubmit_color": "#ffffff",
                                "oxy-form_widget_slug_ffbtnsubmit_width": "100",
                                "oxy-form_widget_-ff-btn-submit_typography_text-transform": "uppercase",
                                "oxy-form_widget_-ff-btn-submit_typography_font-weight": "500",
                                "oxy-form_widget_-ff-btn-submit_typography_letter-spacing": "2",
                                "oxy-form_widget_-fluentform -ff-el-input--label label_typography_font-family": [
                                  "global",
                                  "Text"
                                ],
                                "oxy-form_widget_-ff-el-form-control_typography_font-family": [
                                  "global",
                                  "Text"
                                ],
                                "oxy-form_widget_-ff-el-form-control_typography_font-size": "15",
                                "oxy-form_widget_slug_fluentformffelinputlabellabel_color": "var(--dark-color)",
                                "oxy-form_widget_-fluentform -ff-el-input--label label_typography_font-size": "16"
                              },
                              "nicename": "Fluent Form (#38)",
                              "hover": {
                                "oxy-form_widget_slug_ffbtnsubmitbackground_color": "var(--primary-hover-color)"
                              },
                              "activeselector": false
                            },
                            "depth": 5
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "meta_keys": [
      "oxygen_lock_post_edit_mode"
    ],
    "outerTemplateData": {
      "edit_link": "https:\/\/jsontesting.tempurl.host\/wp-admin\/post.php?post=15&action=edit",
      "template_name": "main"
    }
  }

  try {
    const data = JSON.stringify(contactPageJson);
    console.log(data);
    res.json(data); // send JSON string for content area
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

app.post('/api/chat/post/about', async (req, res, next) => {
  let userMessage = req.body.message; // Get message from request body
  let responseContent = {};

  const getContent = async (userMessage) => {

    if (userMessage === "") {
      return res.status(400).send("Message cannot be empty");
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          response_format: { type: "json_object" },
          messages: [
            {
              "role": "system",
              "content": "json"
            },
            {
              role: 'user',
              content: userMessage
            }
          ]
        })
      });

      const data = await response.json(); // Get JSON response
      const dataJson = data["choices"][0]["message"]["content"]; // Grab JSON string
      console.log(data);
      console.log(dataJson);
      return JSON.parse(dataJson);
    }
    catch (err) {
      next(err); // Pass error to error handler
    }
  }
  const getOxyContent = async () => {
    responseContent = await getContent(userMessage);
    console.log(responseContent);
    let h2Content = responseContent["h2Content"]; // About Company
    let h2Heading = responseContent["h2Header"]; // About company
    let h3Heading = responseContent["h3Content"]; // CTA
    let h3Content = responseContent["h3Header"]; // CTA Content


    let aboutPageJson = {
      "id": 0,
      "name": "root",
      "depth": 0,
      "children": [
        {
          "id": 128,
          "name": "ct_section",
          "options": {
            "ct_id": 128,
            "ct_parent": 0,
            "selector": "section-128-22",
            "original": {
              "background-image": "https:\/\/jsontesting.tempurl.host\/wp-content\/uploads\/2023\/02\/about_hero_1920x520.jpg",
              "overlay-color": "rgba(255,255,255,0.25)",
              "background-size": "cover",
              "background-repeat": "no-repeat",
              "background-position-top": "20",
              "background-position-top-unit": "%",
              "container-padding-top-unit": "",
              "container-padding-bottom-unit": "",
              "container-padding-right-unit": "",
              "container-padding-left-unit": "",
              "padding-top-unit": "",
              "padding-right-unit": "",
              "padding-bottom-unit": "",
              "padding-left-unit": "",
              "margin-top-unit": "",
              "margin-right-unit": "",
              "margin-bottom-unit": "",
              "margin-left-unit": "",
              "width-unit": "",
              "min-width-unit": "",
              "min-width": "",
              "max-width-unit": "",
              "max-width": "",
              "height-unit": "",
              "height": "",
              "min-height-unit": "",
              "min-height": "",
              "max-height-unit": "",
              "max-height": "",
              "background-position-left-unit": "%",
              "background-position-left": "100",
              "background-blend-mode": "multiply",
              "display": "flex",
              "flex-direction": "row",
              "align-items": "center",
              "justify-content": "center"
            },
            "nicename": "Hero 8",
            "classes": [
              "masthd-height"
            ],
            "activeselector": false,
            "ct_depth": 1,
            "media": {
              "phone-landscape": {
                "original": {
                  "background-position-left": "65",
                  "background-position-left-unit": "%"
                }
              },
              "phone-portrait": {
                "original": {
                  "background-position-left": "50",
                  "background-position-left-unit": "%"
                }
              }
            }
          },
          "children": [
            {
              "id": 129,
              "name": "ct_div_block",
              "options": {
                "ct_id": 129,
                "ct_parent": 128,
                "selector": "div_block-129-22",
                "classes": [
                  "w-5by6",
                  "vertical",
                  "text-center",
                  "md-w-full",
                  "items-center"
                ],
                "nicename": "Div (#19)",
                "ct_depth": "2",
                "original": {
                  "text-align": "center",
                  "align-items": "center",
                  "justify-content": "center"
                },
                "activeselector": false
              },
              "children": [
                {
                  "id": 131,
                  "name": "ct_headline",
                  "options": {
                    "ct_id": 131,
                    "ct_parent": 129,
                    "selector": "headline-131-22",
                    "classes": [
                      "text-shadow",
                      "color-white",
                      "h1-alt"
                    ],
                    "activeselector": "h1-alt",
                    "nicename": "Heading (#26)",
                    "ct_depth": false,
                    "ct_content": "<span id=\"ct-placeholder-138\"><\/span>",
                    "original": []
                  },
                  "depth": 3,
                  "children": [
                    {
                      "id": 138,
                      "name": "ct_span",
                      "options": {
                        "ct_id": 138,
                        "ct_parent": 131,
                        "selector": "span-138-22",
                        "original": [],
                        "nicename": "Span (#138)",
                        "ct_content": "[oxygen ct_sign_sha256='4953f0e5dc8434ef3d8b60770b89ba38e6fac278d3c8586b494618d2d88f933e' data='title' ]"
                      },
                      "depth": 4
                    }
                  ]
                }
              ],
              "depth": 2
            }
          ],
          "depth": 1
        },
        {
          "id": 8,
          "name": "ct_section",
          "options": {
            "ct_id": 8,
            "ct_parent": 0,
            "selector": "section-8-22",
            "classes": [
              "items-center",
              "text-center",
              "bg"
            ],
            "activeselector": false,
            "nicename": "TextContent6",
            "ct_depth": 1
          },
          "children": [
            {
              "id": 9,
              "name": "ct_div_block",
              "options": {
                "ct_id": 9,
                "ct_parent": 8,
                "selector": "div_block-9-22",
                "classes": [
                  "w-3by4",
                  "md-w-full"
                ],
                "activeselector": false,
                "nicename": "Div (#2)",
                "ct_depth": "2",
                "original": {
                  "text-align": "left",
                  "align-items": "center"
                }
              },
              "children": [
                {
                  "id": 10,
                  "name": "ct_headline",
                  "options": {
                    "ct_id": 10,
                    "ct_parent": 9,
                    "selector": "headline-10-22",
                    "original": {
                      "tag": "h2"
                    },
                    "classes": [
                      "color-dark",
                      "mb-6",
                      "h1-alt"
                    ],
                    "activeselector": "h1-alt",
                    "nicename": "Heading (#3)",
                    "ct_depth": false,
                    "ct_content": h2Heading
                  },
                  "depth": 3
                },
                {
                  "id": 11,
                  "name": "ct_text_block",
                  "options": {
                    "ct_id": 11,
                    "ct_parent": 9,
                    "selector": "text_block-11-22",
                    "classes": [
                      "color-paragraph"
                    ],
                    "activeselector": false,
                    "nicename": "Text (#11)",
                    "ct_depth": false,
                    "ct_content": h2Content,
                    "original": []
                  },
                  "depth": 3
                }
              ],
              "depth": 2
            }
          ],
          "depth": 1
        },
        {
          "id": 71,
          "name": "ct_section",
          "options": {
            "ct_id": 71,
            "ct_parent": 0,
            "selector": "section-71-22",
            "nicename": "Team 25",
            "classes": [
              "bg-alt"
            ],
            "activeselector": "bg-alt",
            "ct_depth": 1,
            "original": {
              "background-image": "https:\/\/jsontesting.tempurl.host\/wp-content\/uploads\/2022\/12\/3_nov_17-Converted-01.svg",
              "background-size": "contain",
              "background-repeat": "no-repeat",
              "background-position-left-unit": "%",
              "background-position-left": "100"
            }
          },
          "children": [
            {
              "id": 144,
              "name": "ct_new_columns",
              "options": {
                "ct_id": 144,
                "ct_parent": 71,
                "selector": "new_columns-144-22",
                "original": {
                  "image_type": "2",
                  "attachment_size": "full"
                },
                "nicename": "Columns (#144)",
                "activeselector": false
              },
              "depth": 2,
              "children": [
                {
                  "id": 145,
                  "name": "ct_div_block",
                  "options": {
                    "ct_id": 145,
                    "ct_parent": 144,
                    "selector": "div_block-145-22",
                    "original": {
                      "image_type": "2",
                      "attachment_size": "full",
                      "width": "50",
                      "width-unit": "%"
                    },
                    "nicename": "Div (#145)",
                    "activeselector": false
                  },
                  "depth": 2,
                  "children": [
                    {
                      "id": 75,
                      "name": "ct_headline",
                      "options": {
                        "ct_id": 75,
                        "ct_parent": 145,
                        "selector": "headline-75-22",
                        "original": {
                          "tag": "h3"
                        },
                        "classes": [
                          "lg-mr-0",
                          "mr-3",
                          "h3",
                          "color-dark"
                        ],
                        "activeselector": "color-dark",
                        "ct_depth": false,
                        "nicename": "Heading (#75)",
                        "ct_content": `${h3Heading} heading&nbsp;`
                      },
                      "depth": 3
                    },
                    {
                      "id": 107,
                      "name": "ct_text_block",
                      "options": {
                        "ct_id": 107,
                        "ct_parent": 145,
                        "selector": "text_block-107-22",
                        "classes": [
                          "color-paragraph",
                          "mt-4"
                        ],
                        "activeselector": "mt-4",
                        "nicename": "Text (#107)",
                        "ct_depth": false,
                        "ct_content": h3Content,
                        "original": []
                      },
                      "depth": 3
                    },
                    {
                      "id": 140,
                      "name": "ct_link_text",
                      "options": {
                        "ct_id": 140,
                        "ct_parent": 145,
                        "selector": "link_text-140-22",
                        "original": {
                          "url": "\/contact"
                        },
                        "ct_content": "Contact Us",
                        "nicename": "Button Primary",
                        "classes": [
                          "btn-m",
                          "btn-primary",
                          "mt-8"
                        ],
                        "activeselector": "mt-8"
                      },
                      "depth": 3
                    }
                  ]
                },
                {
                  "id": 146,
                  "name": "ct_div_block",
                  "options": {
                    "ct_id": 146,
                    "ct_parent": 144,
                    "selector": "div_block-146-22",
                    "original": {
                      "image_type": "2",
                      "attachment_size": "full",
                      "width": "50",
                      "width-unit": "%"
                    },
                    "nicename": "Div (#146)",
                    "activeselector": false
                  },
                  "depth": 2,
                  "children": [
                    {
                      "id": 152,
                      "name": "ct_image",
                      "options": {
                        "ct_id": 152,
                        "ct_parent": 146,
                        "selector": "image-152-22",
                        "original": {
                          "image_type": "2",
                          "attachment_size": "full",
                          "attachment_id": 77,
                          "attachment_height": 661,
                          "attachment_width": 880,
                          "attachment_url": "https:\/\/jsontesting.tempurl.host\/wp-content\/uploads\/2023\/02\/home_sec1_880x680.jpg",
                          "width": "880"
                        },
                        "nicename": "Image (#152)",
                        "activeselector": "rounded-lg",
                        "classes": [
                          "rounded-lg"
                        ]
                      },
                      "depth": 3
                    }
                  ]
                }
              ]
            }
          ],
          "depth": 1
        }
      ],
      "meta_keys": [
        "oxygen_lock_post_edit_mode"
      ],
      "outerTemplateData": {
        "edit_link": "https:\/\/jsontesting.tempurl.host\/wp-admin\/post.php?post=15&action=edit",
        "template_name": "main"
      }
    }
    try {
      const data = JSON.stringify(aboutPageJson);
      console.log(data);
      res.json(data); // send JSON string for content area
    }
    catch (err) {
      next(err); // Pass error to error handler
    }
  }
  getOxyContent(responseContent);
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
})

// Server listening functions
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})