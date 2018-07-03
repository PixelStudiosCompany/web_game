# web_game is a demo game written on JS.
----------------------------------------

For using mysql in game, type in sql shell:

*create database web_game;
use web_game;
create table players (id int not null primary key auto_increment, nickname varchar(20), password varchar(20), hp int, xp int);*