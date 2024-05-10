import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch, { Headers } from 'node-fetch';
import fs from 'fs';
import { Buffer } from 'buffer';

const headers = new Headers();
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

// Post request generate topics
app.post('/api/chat/topic', async (req, res, next) => {
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
        model: 'gpt-4-turbo-2024-04-09',
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

    const data = await response.json();
    const dataJson = data["choices"][0]["message"]["content"]; // Grab JSON string
    console.log(JSON.parse(dataJson));
    res.json(JSON.parse(dataJson)); // Chat String output
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

// Post request generate prompt
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
        model: 'gpt-4-turbo-2024-04-09',
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

    const data = await response.json();
    const dataJson = data["choices"][0]["message"]["content"]; // Grab JSON string
    console.log(JSON.parse(dataJson));
    res.json(JSON.parse(dataJson)); // Chat String output
  }
  catch (err) {
    next(err); // Pass error to error handler
  }
});

// Post request generate prompt
app.post('/api/chat/article/post', async (req, res, next) => {
  let username = 'ocgdev';
  let password = req.body.password;
  let apiUrl = 'https://dgradytesting.tempurl.host/wp-json/wp/v2/posts';
  let postObj = {
    "title": req.body.title,

    "content": `${req.body.content}`,

    "status": 'publish'
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

app.get('/api/chat/article/posttest', async (req, res, next) => {
  let username = 'ocgdev';
  let password = 'Iputty9126!';
  let apiUrl = 'https://dgradytesting.tempurl.host/wp-json/wp/v2/posts';
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.send(data);
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

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
})

// Server listening functions
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})