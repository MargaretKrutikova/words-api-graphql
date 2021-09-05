import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// eslint-disable-next-line no-useless-escape
const escape = (str) => `\"${str.replace(/\"/g, '\\"')}\"`;

const apiUrl = process.env.GRAPHQL_API_URL;

const saveWord = ({
  value,
  translations,
  explanations,
  usages,
  createdDate,
  updatedDate,
}) => {
  const graphQLArray = (array, name) =>
    array.length > 0 ? `${name}: [${escape(array.join(", "))}],` : "";
  const query = `
      mutation {
        saveWord(input:{
            value: ${escape(value)},
            ${graphQLArray(translations, "translations")}
            ${graphQLArray(explanations, "explanations")}
            ${graphQLArray(usages, "usages")}
            createdDate: ${escape(createdDate)}, 
            updatedDate: ${escape(updatedDate)}}) {
          id
        }
      }`;

  console.log(query);
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: null }),
  })
    .then((res) => res.text())
    .then((body) => console.log(body))
    .catch((error) => console.error(error));
};

const readJsonWords = (filename) => {
  const json = fs.readFileSync(filename);
  const wordsArray = JSON.parse(json);

  const parseMongoDBDate = (date) => {
    if (typeof date === "number") {
      return new Date(date);
    }
    return new Date(date.$date);
  };

  const parsedWords = [];
  for (const word of wordsArray) {
    const id = word._id.$oid;
    const value = word.value;
    const translations = word.translations || [];
    const explanations = word.explanations || [];
    const usages = word.usages || [];
    const createdDate = parseMongoDBDate(word.createdDate).toISOString();
    const updatedDate = word.updatedDate
      ? parseMongoDBDate(word.updatedDate).toISOString()
      : createdDate;

    if (!id || !value || !createdDate) {
      throw Error("One of the mandatory values are empty!");
    }

    parsedWords.push({
      id,
      value,
      translations,
      explanations,
      usages,
      createdDate,
      updatedDate,
    });
  }

  return parsedWords;
};

const main = () => {
  const words = readJsonWords("../words.json");

  for (const word of words) {
    saveWord(word);
  }
};

main();
