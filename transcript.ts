import * as fs from "fs";
import * as path from "path";

(async () => {
  const troparions = fs.readFileSync(path.resolve(__dirname, "tropare.csv"), {
    encoding: "utf-8",
  });

  // Letters
  // load letter substitution dictionary
  const letterSubstitutionDictionary = fs.readFileSync(
    path.resolve(__dirname, "transcript-dictionary-letters.txt"),
    {
      encoding: "utf-8",
    }
  );
  const letterSubstitutionMap = new Map<string, string>();
  for (const line of letterSubstitutionDictionary.split(/[\r\n]+/)) {
    if (line.startsWith("#")) {
      continue; //comments
    }
    const lineSplitted = line.split(" ");
    letterSubstitutionMap.set(lineSplitted[0], lineSplitted[1]);
  }
  // substitute letters
  let troparionLetterSubtituted = "";
  for (let i = 0; i < troparions.length; i++) {
    let character: string;
    if (letterSubstitutionMap.has(troparions[i])) {
      character = letterSubstitutionMap.get(troparions[i]) as string;
    } else {
      character = troparions[i];
    }
    troparionLetterSubtituted += character;
  }
  console.log(`>>> ${troparionLetterSubtituted}`);

  // Groups
  // load group substitution dictionary
  const groupSubstitutionDictionary = fs.readFileSync(
    path.resolve(__dirname, "transcript-dictionary-groups.txt"),
    {
      encoding: "utf-8",
    }
  );
  const groupSubstitutionMap = new Map<string, string>();
  for (const line of groupSubstitutionDictionary.split(/[\r\n]+/)) {
    if (line.startsWith("#")) {
      continue; //comments
    }
    const lineSplitted = line.split(" ");
    groupSubstitutionMap.set(
      lineSplitted[0],
      lineSplitted[1] ? lineSplitted[1] : ""
    );
  }

  let troparionGroupSubstituted = troparionLetterSubtituted;
  // substitute groups
  for (let [key, value] of groupSubstitutionMap) {
    console.log(`Group: ${key} ${value}`);
    troparionGroupSubstituted = troparionGroupSubstituted.replace(
      new RegExp(key, "g"),
      value
    );
  }

  console.log(`>>> ${troparionGroupSubstituted}`);
  const output = fs.createWriteStream("tropare-prepisane.csv");
  output.write(troparionGroupSubstituted);
})();
