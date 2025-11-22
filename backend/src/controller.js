const fs = require("node:fs/promises");
const path = require('path');

const getData = async (req, res) => {
  try {
    //This is code to fetch url.json file content. Ignore these lines.
    const filePath = path.join(__dirname, 'url.json'); 
    const data = await fs.readFile(filePath, 'utf8');
    const parsedData = JSON.parse(data); 
    if (!parsedData.urls) {
      throw new NotFoundError("Could not find any pyqs.");
    }

    //This is main thing. Here it is shown how u will fetch queries from http request sent.
    const { branch, fromYear, semester, subject, toYear } = req.query;
    // now here you will send these queries to database to search specific results and then in place of parsedData 
    // you will send yours' variable which will contain arrays of objects like this :
    //  {
    //   id: 3,
    //   name: 'sample_3.pdf',
    //   url: 'https://raw.githubusercontent.com/coder6970/dummy_database/main/sample3.pdf'
    // }
    // Also each object of parsedData looks this above example

    //NOTE : Here parsedData is not in json format but below function will convert it into json format and 
    // then send it to the front-end.
    return res.status(201).json(parsedData);
  } catch (err) {
    return res.status(500).json({
      data: {},
      success: false,
      message: "Something went wrong in the project controller",
      error: err,
    });
  }
};

const uploadData = (req, res) => {
  try {
    res.json({ message: "File uploaded successfully", file: req.file });
  } catch (err) {
    console.log("inside error");
    res.status(500).json({ error: err.message });
  }
};

module.exports = {getData,uploadData}