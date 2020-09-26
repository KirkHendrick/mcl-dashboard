#!/bin/sh

ARCHIVE_PATH="../archive/archive.json"
MCL_REPO_PATH="$HOME/metacognition-log/"
YEAR=$(date +"%Y")
MONTH=$(date +"%B")
DAY=$(date +"%d")
HOUR=$(date +"%H")
MINUTE=$(date +"%M")
FULL_PATH="${MCL_REPO_PATH}${YEAR}/${MONTH}/archive/"

echo "Starting automatic archive..."

echo "Retrieving data from airtable..."
../archive_airtable.py

echo "Setting up directory in git repo at ${FULL_PATH} ..."
mkdir -p "${FULL_PATH}"

echo "Copying to git repo at ${FULL_PATH} ..."
cp "${ARCHIVE_PATH}" "${FULL_PATH}"

echo "Committing to git..."
cd "${FULL_PATH}" || exit
git checkout archive
git add archive.json
git commit -m "auto archive ${YEAR}/${MONTH}/${DAY} ${HOUR}:${MINUTE}"
git push origin archive
