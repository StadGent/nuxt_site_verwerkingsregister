#!/bin/bash

#===============================================================================
#
#          FILE:  postinstall.sh
#
#         USAGE:  ./postinstall.sh --type=patch
#
#   DESCRIPTION: Copies gent_styleguide build assets to the assets folder.
#
#       OPTIONS:  ---
#  REQUIREMENTS:  ---
#          BUGS:  ---
#         NOTES:  ---
#        AUTHOR:  Bart Delrue bart.delrue@digipolis.gent
#       COMPANY:  Digipolis Gent
#       VERSION:  1.0
#       CREATED:  31/08/2018
#      REVISION:  ---
#===============================================================================

#
# Create the necessary directories and move files to them after npm install or yarn install is run.
#
if [ -d "node_modules/gent_styleguide/build/styleguide" ]; then
echo "Copy styleguide assets to ~/assets"

  rm -rf assets/styleguide;

  cp -R node_modules/gent_styleguide/build/styleguide assets;

fi
