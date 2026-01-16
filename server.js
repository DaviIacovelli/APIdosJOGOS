import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

app.use(express.json());

app.use("/api", (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

let jogos = [
  {
    id: 1,
    titulo: "The Legend of Zelda: Breath of the Wild",
    description:
      "Uma aventura épica em um vasto mundo aberto onde Link desperta de um sono de 100 anos para derrotar Calamity Ganon e salvar o reino de Hyrule.",
    "image-url": "https://storage.gamehub.com/images/zelda_botw.jpg",
    platform: ["Nintendo Switch", "Wii U"],
    categories: ["Ação", "Aventura", "Mundo Aberto"],
    release: "2017-03-03",
  },
  {
    id: 2,
    titulo: "Red Dead Redemption 2",
    description:
      "Um western épico que segue Arthur Morgan e a gangue Van der Linde em sua luta pela sobrevivência no selvagem oeste americano em declínio.",
    "image-url": "https://storage.gamehub.com/images/rdr2.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["Ação", "Aventura", "Mundo Aberto"],
    release: "2018-10-26",
  },
  {
    id: 3,
    titulo: "Elden Ring",
    description:
      "Um RPG de ação souls-like ambientado em um mundo de fantasia sombrio criado por Hidetaka Miyazaki e George R.R. Martin com combate desafiador e exploração épica.",
    "image-url": "https://storage.gamehub.com/images/elden_ring.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["RPG", "Ação", "Mundo Aberto"],
    release: "2022-02-25",
  },
  {
    id: 4,
    titulo: "God of War Ragnarök",
    description:
      "Kratos e Atreus embarcam em uma jornada emocionante pela mitologia nórdica enquanto enfrentam o iminente apocalipse e deuses vingativos em busca de respostas.",
    "image-url": "https://storage.gamehub.com/images/gow_ragnarok.jpg",
    platform: ["PlayStation 5", "PlayStation 4"],
    categories: ["Ação", "Aventura"],
    release: "2022-11-09",
  },
  {
    id: 5,
    titulo: "Cyberpunk 2077",
    description:
      "Um RPG de ação futurista ambientado em Night City onde você joga como V, um mercenário personalizável em busca de um implante único que contém a chave para a imortalidade.",
    "image-url": "https://storage.gamehub.com/images/cyberpunk2077.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["RPG", "Ação", "Mundo Aberto"],
    release: "2020-12-10",
  },
  {
    id: 6,
    titulo: "The Witcher 3: Wild Hunt",
    description:
      "Geralt de Rivia, um caçador de monstros profissional, busca sua filha adotiva em um mundo de fantasia aberto repleto de escolhas morais complexas e missões envolventes.",
    "image-url": "https://storage.gamehub.com/images/witcher3.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC", "Nintendo Switch"],
    categories: ["RPG", "Ação", "Mundo Aberto"],
    release: "2015-05-19",
  },
  {
    id: 7,
    titulo: "Minecraft",
    description:
      "Um jogo sandbox de construção e sobrevivência onde jogadores podem explorar, minerar recursos, construir estruturas elaboradas e enfrentar criaturas em mundos proceduralmente gerados infinitos.",
    "image-url": "https://storage.gamehub.com/images/minecraft.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch", "Mobile"],
    categories: ["Sandbox", "Sobrevivência", "Aventura"],
    release: "2011-11-18",
  },
  {
    id: 8,
    titulo: "Grand Theft Auto V",
    description:
      "Três criminosos com histórias entrelaçadas executam assaltos ousados em Los Santos enquanto lidam com suas vidas turbulentas e a corrupção que os cerca.",
    "image-url": "https://storage.gamehub.com/images/gtav.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["Ação", "Aventura", "Mundo Aberto"],
    release: "2013-09-17",
  },
  {
    id: 9,
    titulo: "Dark Souls III",
    description:
      "O capítulo final da aclamada série souls oferece combate tático brutal, chefes épicos e uma atmosfera sombria enquanto os jogadores tentam impedir o fim do mundo.",
    "image-url": "https://storage.gamehub.com/images/darksouls3.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["RPG", "Ação"],
    release: "2016-04-12",
  },
  {
    id: 10,
    titulo: "Hades",
    description:
      "Um roguelike de ação onde Zagreus, filho de Hades, tenta escapar do submundo grego em uma jornada repleta de combate dinâmico, personagens carismáticos e narrativa envolvente.",
    "image-url": "https://storage.gamehub.com/images/hades.jpg",
    platform: [
      "PC",
      "Nintendo Switch",
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
    ],
    categories: ["Roguelike", "Ação"],
    release: "2020-09-17",
  },
  {
    id: 11,
    titulo: "Hollow Knight",
    description:
      "Um metroidvania desafiador ambientado em um reino de insetos subterrâneo esquecido, com exploração intrincada, combate preciso e uma atmosfera melancólica deslumbrante.",
    "image-url": "https://storage.gamehub.com/images/hollow_knight.jpg",
    platform: ["PC", "Nintendo Switch", "PlayStation 4", "Xbox One"],
    categories: ["Metroidvania", "Ação", "Aventura"],
    release: "2017-02-24",
  },
  {
    id: 12,
    titulo: "Sekiro: Shadows Die Twice",
    description:
      "Um shinobi de um braço só busca vingança e resgatar seu mestre em um Japão feudal sombrio repleto de inimigos letais e combate baseado em aparar golpes.",
    "image-url": "https://storage.gamehub.com/images/sekiro.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["Ação", "Aventura"],
    release: "2019-03-22",
  },
  {
    id: 13,
    titulo: "Bloodborne",
    description:
      "Um caçador explora a cidade gótica vitoriana de Yharnam, infestada por bestas horrendas e segredos cósmicos, em busca da cura para uma misteriosa doença.",
    "image-url": "https://storage.gamehub.com/images/bloodborne.jpg",
    platform: ["PlayStation 4"],
    categories: ["RPG", "Ação"],
    release: "2015-03-24",
  },
  {
    id: 14,
    titulo: "The Last of Us Part II",
    description:
      "Cinco anos após a jornada original, Ellie embarca em uma busca violenta por justiça em um mundo pós-apocalíptico brutal e moralmente complexo.",
    "image-url": "https://storage.gamehub.com/images/tlou2.jpg",
    platform: ["PlayStation 5", "PlayStation 4"],
    categories: ["Ação", "Aventura"],
    release: "2020-06-19",
  },
  {
    id: 15,
    titulo: "Spider-Man: Miles Morales",
    description:
      "Miles Morales assume o manto do Homem-Aranha e precisa defender sua vizinhança do Brooklyn enquanto domina seus novos poderes bioelétricos em uma emocionante aventura de super-herói.",
    "image-url": "https://storage.gamehub.com/images/miles_morales.jpg",
    platform: ["PlayStation 5", "PlayStation 4"],
    categories: ["Ação", "Aventura"],
    release: "2020-11-12",
  },
  {
    id: 16,
    titulo: "Horizon Zero Dawn",
    description:
      "Aloy, uma caçadora habilidosa, explora um mundo pós-apocalíptico dominado por máquinas-dinossauros enquanto descobre os segredos de sua origem e do passado da civilização.",
    "image-url": "https://storage.gamehub.com/images/horizon_zero_dawn.jpg",
    platform: ["PlayStation 4", "PC"],
    categories: ["RPG", "Ação", "Mundo Aberto"],
    release: "2017-02-28",
  },
  {
    id: 17,
    titulo: "Ghost of Tsushima",
    description:
      "Jin Sakai deve abandonar os códigos samurais e adotar táticas de guerrilha para libertar a ilha de Tsushima da invasão mongol no século XIII.",
    "image-url": "https://storage.gamehub.com/images/ghost_tsushima.jpg",
    platform: ["PlayStation 5", "PlayStation 4"],
    categories: ["Ação", "Aventura", "Mundo Aberto"],
    release: "2020-07-17",
  },
  {
    id: 18,
    titulo: "Stardew Valley",
    description:
      "Herde a velha fazenda do seu avô e transforme campos abandonados em uma propriedade próspera enquanto constrói relacionamentos com os moradores da cidade em um simulador relaxante.",
    "image-url": "https://storage.gamehub.com/images/stardew_valley.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch", "Mobile"],
    categories: ["Simulação", "RPG"],
    release: "2016-02-26",
  },
  {
    id: 19,
    titulo: "Celeste",
    description:
      "Uma jovem chamada Madeline escala a perigosa Montanha Celeste enquanto enfrenta seus próprios demônios internos neste desafiador platformer com uma história comovente sobre saúde mental.",
    "image-url": "https://storage.gamehub.com/images/celeste.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Plataforma", "Aventura"],
    release: "2018-01-25",
  },
  {
    id: 20,
    titulo: "Ori and the Will of the Wisps",
    description:
      "O espírito guardião Ori embarca em uma jornada emocionante para descobrir seu verdadeiro destino em um mundo de fantasia deslumbrante repleto de desafios e puzzles.",
    "image-url": "https://storage.gamehub.com/images/ori_wisps.jpg",
    platform: ["Xbox Series X/S", "Xbox One", "PC", "Nintendo Switch"],
    categories: ["Metroidvania", "Plataforma"],
    release: "2020-03-11",
  },
  {
    id: 21,
    titulo: "Resident Evil Village",
    description:
      "Ethan Winters busca sua filha sequestrada em uma misteriosa vila europeia repleta de criaturas sobrenaturais e senhores territoriais assustadores neste survival horror tenso.",
    "image-url": "https://storage.gamehub.com/images/re_village.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["Terror", "Ação"],
    release: "2021-05-07",
  },
  {
    id: 22,
    titulo: "Death Stranding",
    description:
      "Sam Porter Bridges atravessa uma América pós-apocalíptica fragmentada, reconectando cidades isoladas enquanto enfrenta entidades sobrenaturais e terroristas em uma experiência narrativa única de Hideo Kojima.",
    "image-url": "https://storage.gamehub.com/images/death_stranding.jpg",
    platform: ["PlayStation 5", "PlayStation 4", "PC"],
    categories: ["Ação", "Aventura"],
    release: "2019-11-08",
  },
  {
    id: 23,
    titulo: "Monster Hunter: World",
    description:
      "Caçadores exploram ecossistemas vibrantes rastreando e combatendo monstros gigantescos em cooperativo, coletando recursos para criar equipamentos cada vez mais poderosos neste RPG de ação.",
    "image-url": "https://storage.gamehub.com/images/mh_world.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["RPG", "Ação"],
    release: "2018-01-26",
  },
  {
    id: 24,
    titulo: "Control",
    description:
      "Jesse Faden se torna diretora do Bureau Federal de Controle e investiga fenômenos paranormais enquanto combate uma força sobrenatural conhecida como Hiss neste thriller psicológico de ação.",
    "image-url": "https://storage.gamehub.com/images/control.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["Ação", "Aventura"],
    release: "2019-08-27",
  },
  {
    id: 25,
    titulo: "Doom Eternal",
    description:
      "O Doom Slayer retorna para impedir a invasão demoníaca da Terra com combate frenético em primeira pessoa, armas devastadoras e movimentação acrobática em cenários infernais.",
    "image-url": "https://storage.gamehub.com/images/doom_eternal.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["FPS", "Ação"],
    release: "2020-03-20",
  },
  {
    id: 26,
    titulo: "Persona 5 Royal",
    description:
      "Estudantes secundaristas por dia, ladrões de corações à noite, os Phantom Thieves infiltram palácios cognitivos para reformar adultos corruptos neste RPG japonês estiloso com mecânicas sociais profundas.",
    "image-url": "https://storage.gamehub.com/images/persona5_royal.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["RPG", "Aventura"],
    release: "2019-10-31",
  },
  {
    id: 27,
    titulo: "Final Fantasy VII Remake",
    description:
      "Uma reimaginação moderna do clássico RPG onde Cloud Strife e o grupo eco-terrorista AVALANCHE lutam contra a megacorporação Shinra em Midgar com combate em tempo real renovado.",
    "image-url": "https://storage.gamehub.com/images/ff7_remake.jpg",
    platform: ["PlayStation 5", "PlayStation 4", "PC"],
    categories: ["RPG", "Ação"],
    release: "2020-04-10",
  },
  {
    id: 28,
    titulo: "Animal Crossing: New Horizons",
    description:
      "Crie sua ilha paradisíaca dos sonhos, decore sua casa, faça amizade com adoráveis moradores animais e relaxe neste simulador de vida tranquilo e criativo.",
    "image-url": "https://storage.gamehub.com/images/animal_crossing_nh.jpg",
    platform: ["Nintendo Switch"],
    categories: ["Simulação", "Aventura"],
    release: "2020-03-20",
  },
  {
    id: 29,
    titulo: "Among Us",
    description:
      "Tripulantes trabalham juntos para completar tarefas em uma nave espacial enquanto impostores secretos sabotam e eliminam jogadores neste fenômeno multiplayer de dedução social.",
    "image-url": "https://storage.gamehub.com/images/among_us.jpg",
    platform: [
      "PC",
      "Mobile",
      "Nintendo Switch",
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
    ],
    categories: ["Multiplayer", "Social"],
    release: "2018-06-15",
  },
  {
    id: 30,
    titulo: "Fall Guys: Ultimate Knockout",
    description:
      "Sessenta jogadores competem em corridas de obstáculos caóticas e desafios em equipe hilários até que apenas um permaneça neste battle royale colorido e divertido.",
    "image-url": "https://storage.gamehub.com/images/fall_guys.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["Battle Royale", "Multiplayer"],
    release: "2020-08-04",
  },
  {
    id: 31,
    titulo: "Valorant",
    description:
      "Agentes com habilidades únicas enfrentam-se em partidas táticas de tiro em primeira pessoa cinco contra cinco onde precisão, estratégia e trabalho em equipe determinam a vitória.",
    "image-url": "https://storage.gamehub.com/images/valorant.jpg",
    platform: ["PC"],
    categories: ["FPS", "Multiplayer"],
    release: "2020-06-02",
  },
  {
    id: 32,
    titulo: "Apex Legends",
    description:
      "Esquadrões de três lendas com habilidades distintas competem para serem os últimos sobreviventes em um battle royale de ritmo acelerado com movimentação fluida e combate intenso.",
    "image-url": "https://storage.gamehub.com/images/apex_legends.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["Battle Royale", "FPS"],
    release: "2019-02-04",
  },
  {
    id: 33,
    titulo: "Fortnite",
    description:
      "Cem jogadores descem em uma ilha e lutam para serem os últimos de pé, coletando armas e construindo estruturas neste fenômeno cultural battle royale com constantes atualizações temáticas.",
    "image-url": "https://storage.gamehub.com/images/fortnite.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
      "Mobile",
    ],
    categories: ["Battle Royale", "Tiro"],
    release: "2017-07-25",
  },
  {
    id: 34,
    titulo: "Overwatch 2",
    description:
      "Heróis de todo o mundo se unem em combates em equipe objetivos cinco contra cinco com classes distintas, habilidades únicas e mapas variados neste shooter competitivo.",
    "image-url": "https://storage.gamehub.com/images/overwatch2.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["FPS", "Multiplayer"],
    release: "2022-10-04",
  },
  {
    id: 35,
    titulo: "League of Legends",
    description:
      "Dois times de cinco campeões com habilidades únicas batalham para destruir o Nexus inimigo neste MOBA estratégico profundo que se tornou um dos maiores esports do mundo.",
    "image-url": "https://storage.gamehub.com/images/league_legends.jpg",
    platform: ["PC"],
    categories: ["MOBA", "Estratégia"],
    release: "2009-10-27",
  },
  {
    id: 36,
    titulo: "Dota 2",
    description:
      "Heróis com papéis distintos enfrentam-se em intensas batalhas estratégicas cinco contra cinco onde coordenação, mecânica individual e conhecimento profundo do jogo são essenciais para a vitória.",
    "image-url": "https://storage.gamehub.com/images/dota2.jpg",
    platform: ["PC"],
    categories: ["MOBA", "Estratégia"],
    release: "2013-07-09",
  },
  {
    id: 37,
    titulo: "Counter-Strike: Global Offensive",
    description:
      "Terroristas e contra-terroristas enfrentam-se em partidas táticas de tiro competitivo onde cada rodada conta e habilidade precisa, comunicação e estratégia são fundamentais para o sucesso.",
    "image-url": "https://storage.gamehub.com/images/csgo.jpg",
    platform: ["PC"],
    categories: ["FPS", "Multiplayer"],
    release: "2012-08-21",
  },
  {
    id: 38,
    titulo: "Rocket League",
    description:
      "Carros acrobáticos jogam futebol em arenas futuristas neste híbrido único de esportes e corrida que combina física satisfatória com jogabilidade competitiva e acessível.",
    "image-url": "https://storage.gamehub.com/images/rocket_league.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["Esportes", "Corrida"],
    release: "2015-07-07",
  },
  {
    id: 39,
    titulo: "FIFA 23",
    description:
      "A mais recente edição da série de futebol traz gráficos aprimorados, física de bola realista e modos de jogo abrangentes incluindo carreira, Ultimate Team e partidas online.",
    "image-url": "https://storage.gamehub.com/images/fifa23.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["Esportes", "Simulação"],
    release: "2022-09-30",
  },
  {
    id: 40,
    titulo: "NBA 2K23",
    description:
      "O simulador de basquete definitivo oferece gameplay autêntico, modos de carreira imersivos, construção de equipe no MyTeam e ação online competitiva com jogadores da NBA e WNBA.",
    "image-url": "https://storage.gamehub.com/images/nba2k23.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["Esportes", "Simulação"],
    release: "2022-09-09",
  },
  {
    id: 41,
    titulo: "Gran Turismo 7",
    description:
      "O simulador de corrida definitivo retorna com física de condução ultra-realista, mais de quatrocentos carros meticulosamente modelados e circuitos autênticos de todo o mundo.",
    "image-url": "https://storage.gamehub.com/images/gt7.jpg",
    platform: ["PlayStation 5", "PlayStation 4"],
    categories: ["Corrida", "Simulação"],
    release: "2022-03-04",
  },
  {
    id: 42,
    titulo: "Forza Horizon 5",
    description:
      "Explore o vibrante e diverso México em um festival de corrida de mundo aberto com centenas de carros, eventos variados e clima dinâmico espetacular.",
    "image-url": "https://storage.gamehub.com/images/forza_horizon5.jpg",
    platform: ["Xbox Series X/S", "Xbox One", "PC"],
    categories: ["Corrida", "Mundo Aberto"],
    release: "2021-11-05",
  },
  {
    id: 43,
    titulo: "Assassin's Creed Valhalla",
    description:
      "Eivor lidera seu clã viking da Noruega gelada para as ricas terras da Inglaterra medieval, construindo assentamentos e forjando alianças políticas em um mundo aberto épico.",
    "image-url": "https://storage.gamehub.com/images/ac_valhalla.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["RPG", "Ação", "Mundo Aberto"],
    release: "2020-11-10",
  },
  {
    id: 44,
    titulo: "Far Cry 6",
    description:
      "Lute pela liberdade de Yara, uma nação caribenha congelada no tempo sob a tirania de um ditador impiedoso, usando guerrilha criativa e um arsenal improvável de armas.",
    "image-url": "https://storage.gamehub.com/images/farcry6.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["FPS", "Ação", "Mundo Aberto"],
    release: "2021-10-07",
  },
  {
    id: 45,
    titulo: "Battlefield 2042",
    description:
      "Guerras futuristas em larga escala com até cento e vinte e oito jogadores, eventos climáticos extremos e mapas massivos criam batalhas caóticas e imprevisíveis neste shooter multiplayer.",
    "image-url": "https://storage.gamehub.com/images/battlefield2042.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["FPS", "Multiplayer"],
    release: "2021-11-19",
  },
  {
    id: 46,
    titulo: "Call of Duty: Modern Warfare II",
    description:
      "A Task Force 141 retorna para enfrentar ameaças globais em uma campanha cinematográfica intensa e modos multiplayer frenéticos com mapas clássicos e mecânicas renovadas.",
    "image-url": "https://storage.gamehub.com/images/cod_mw2.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["FPS", "Ação"],
    release: "2022-10-28",
  },
  {
    id: 47,
    titulo: "Destiny 2",
    description:
      "Guardiões protegem a humanidade dos últimos de diversas raças alienígenas em um shooter looter online com raids cooperativos desafiadores, PvP competitivo e narrativa expansiva em evolução.",
    "image-url": "https://storage.gamehub.com/images/destiny2.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["FPS", "RPG", "Multiplayer"],
    release: "2017-09-06",
  },
  {
    id: 48,
    titulo: "Warframe",
    description:
      "Ninjas espaciais cooperativos enfrentam hordas de inimigos usando parkour acrobático e um arsenal vasto de armas e warframes personalizáveis neste shooter looter free-to-play.",
    "image-url": "https://storage.gamehub.com/images/warframe.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["FPS", "Ação", "Multiplayer"],
    release: "2013-03-25",
  },
  {
    id: 49,
    titulo: "No Man's Sky",
    description:
      "Explore um universo proceduralmente gerado com quintilhões de planetas únicos, construa bases, pilote naves espaciais e descubra a verdade por trás do misterioso centro do universo.",
    "image-url": "https://storage.gamehub.com/images/no_mans_sky.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["Aventura", "Sobrevivência", "Simulação"],
    release: "2016-08-09",
  },
  {
    id: 50,
    titulo: "Subnautica",
    description:
      "Sobreviva nas profundezas de um oceano alienígena repleto de vida fascinante e perigosa, construa bases subaquáticas e desvende os mistérios deste mundo aquático imersivo.",
    "image-url": "https://storage.gamehub.com/images/subnautica.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["Sobrevivência", "Aventura"],
    release: "2018-01-23",
  },
  {
    id: 51,
    titulo: "Terraria",
    description:
      "Explore, construa e lute em um mundo 2D sandbox repleto de biomas distintos, criaturas desafiadoras e recursos infinitos para criar equipamentos e estruturas elaboradas.",
    "image-url": "https://storage.gamehub.com/images/terraria.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch", "Mobile"],
    categories: ["Sandbox", "Aventura"],
    release: "2011-05-16",
  },
  {
    id: 52,
    titulo: "Don't Starve Together",
    description:
      "Sobreviva em um mundo hostil e bizarro coletando recursos, criando ferramentas e enfrentando criaturas estranhas neste desafiador jogo de sobrevivência cooperativo com arte gótica única.",
    "image-url": "https://storage.gamehub.com/images/dont_starve_together.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Sobrevivência", "Multiplayer"],
    release: "2016-04-21",
  },
  {
    id: 53,
    titulo: "Rust",
    description:
      "Acorde nu em uma ilha hostil e lute pela sobrevivência contra jogadores, animais selvagens e o ambiente enquanto constrói abrigos, forma alianças e trai inimigos neste survival brutal.",
    "image-url": "https://storage.gamehub.com/images/rust.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One"],
    categories: ["Sobrevivência", "Multiplayer"],
    release: "2018-02-08",
  },
  {
    id: 54,
    titulo: "ARK: Survival Evolved",
    description:
      "Desperte em uma ilha misteriosa repleta de dinossauros, dome criaturas pré-históricas, construa bases tribais e sobreviva em um ecossistema perigoso com elementos de ficção científica.",
    "image-url": "https://storage.gamehub.com/images/ark_survival.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC", "Nintendo Switch", "Mobile"],
    categories: ["Sobrevivência", "Ação", "Multiplayer"],
    release: "2017-08-29",
  },
  {
    id: 55,
    titulo: "Valheim",
    description:
      "Vikings mortos em batalha devem provar seu valor em Valheim, explorando um mundo procedural inspirado na mitologia nórdica, construindo assentamentos e derrotando criaturas míticas cooperativamente.",
    "image-url": "https://storage.gamehub.com/images/valheim.jpg",
    platform: ["PC"],
    categories: ["Sobrevivência", "Aventura", "Multiplayer"],
    release: "2021-02-02",
  },
  {
    id: 56,
    titulo: "Satisfactory",
    description:
      "Construa fábricas massivas automatizadas em um planeta alienígena, otimize linhas de produção complexas e explore ambientes hostis neste simulador de construção e gerenciamento em primeira pessoa.",
    "image-url": "https://storage.gamehub.com/images/satisfactory.jpg",
    platform: ["PC"],
    categories: ["Simulação", "Construção"],
    release: "2024-09-10",
  },
  {
    id: 57,
    titulo: "Factorio",
    description:
      "Construa e gerencie fábricas cada vez mais complexas em um planeta alienígena, automatize processos de produção e defenda sua base contra hordas de criaturas nativas neste viciante simulador industrial.",
    "image-url": "https://storage.gamehub.com/images/factorio.jpg",
    platform: ["PC"],
    categories: ["Simulação", "Estratégia"],
    release: "2020-08-14",
  },
  {
    id: 58,
    titulo: "Cities: Skylines",
    description:
      "Projete e gerencie sua própria metrópole, equilibrando zonas residenciais, comerciais e industriais enquanto mantém cidadãos felizes e a cidade funcionando eficientemente neste simulador urbano profundo.",
    "image-url": "https://storage.gamehub.com/images/cities_skylines.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Simulação", "Estratégia"],
    release: "2015-03-10",
  },
  {
    id: 59,
    titulo: "Planet Zoo",
    description:
      "Construa zoológicos detalhados, cuide do bem-estar animal, gerencie equipes e crie habitats autênticos para centenas de espécies neste simulador de gerenciamento encantador e educativo.",
    "image-url": "https://storage.gamehub.com/images/planet_zoo.jpg",
    platform: ["PC"],
    categories: ["Simulação", "Gerenciamento"],
    release: "2019-11-05",
  },
  {
    id: 60,
    titulo: "The Sims 4",
    description:
      "Crie Sims únicos, construa casas dos sonhos e controle todos os aspectos de suas vidas virtuais neste simulador de vida que permite contar histórias ilimitadas e expressar criatividade.",
    "image-url": "https://storage.gamehub.com/images/sims4.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One"],
    categories: ["Simulação", "Casual"],
    release: "2014-09-02",
  },
  {
    id: 61,
    titulo: "Portal 2",
    description:
      "Resolva quebra-cabeças complexos usando uma arma de portal que cria passagens entre superfícies enquanto explora a misteriosa Aperture Science com humor afiado e mecânicas brilhantes.",
    "image-url": "https://storage.gamehub.com/images/portal2.jpg",
    platform: ["PC", "PlayStation 3", "Xbox 360"],
    categories: ["Puzzle", "Aventura"],
    release: "2011-04-19",
  },
  {
    id: 62,
    titulo: "The Witness",
    description:
      "Explore uma ilha misteriosa e colorida resolvendo centenas de quebra-cabeças de linha interconectados que gradualmente revelam camadas profundas de complexidade e filosofia neste puzzle atmosférico.",
    "image-url": "https://storage.gamehub.com/images/the_witness.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Mobile"],
    categories: ["Puzzle", "Aventura"],
    release: "2016-01-26",
  },
  {
    id: 63,
    titulo: "Baba Is You",
    description:
      "Manipule as regras da realidade empurrando palavras que formam as mecânicas do jogo, transformando objetos, paredes e até você mesmo neste puzzle inovador que desafia a lógica tradicional.",
    "image-url": "https://storage.gamehub.com/images/baba_is_you.jpg",
    platform: ["PC", "Nintendo Switch"],
    categories: ["Puzzle", "Indie"],
    release: "2019-03-13",
  },
  {
    id: 64,
    titulo: "Cuphead",
    description:
      "Cuphead e Mugman devem pagar sua dívida com o diabo enfrentando chefes brutais em um run and gun desafiador com animação tradicional inspirada em desenhos dos anos trinta.",
    "image-url": "https://storage.gamehub.com/images/cuphead.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Ação", "Plataforma"],
    release: "2017-09-29",
  },
  {
    id: 65,
    titulo: "Dead Cells",
    description:
      "Um prisioneiro imortal explora uma ilha em constante mudança em um roguelike metroidvania fluido com combate satisfatório, progressão permanente e morte permissiva que reinicia a jornada.",
    "image-url": "https://storage.gamehub.com/images/dead_cells.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch", "Mobile"],
    categories: ["Roguelike", "Metroidvania", "Ação"],
    release: "2018-08-07",
  },
  {
    id: 66,
    titulo: "Risk of Rain 2",
    description:
      "Sobreviventes naufragados enfrentam hordas crescentes de aliens em um planeta hostil neste roguelike cooperativo tridimensional com centenas de itens sinérgicos e dificuldade escalante constante.",
    "image-url": "https://storage.gamehub.com/images/risk_of_rain2.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Roguelike", "Ação", "Multiplayer"],
    release: "2020-08-11",
  },
  {
    id: 67,
    titulo: "Slay the Spire",
    description:
      "Escale a torre enfrentando inimigos com decks de cartas estratégicos que você constrói dinamicamente, combinando elementos de roguelike, deckbuilding e RPG em runs viciantes e únicas.",
    "image-url": "https://storage.gamehub.com/images/slay_the_spire.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch", "Mobile"],
    categories: ["Roguelike", "Card Game", "Estratégia"],
    release: "2019-01-23",
  },
  {
    id: 68,
    titulo: "Undertale",
    description:
      "Uma criança cai no Underground e deve navegar por um reino de monstros onde pode lutar ou fazer amizade com cada criatura neste RPG subversivo com múltiplos finais emocionantes.",
    "image-url": "https://storage.gamehub.com/images/undertale.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["RPG", "Indie"],
    release: "2015-09-15",
  },
  {
    id: 69,
    titulo: "Disco Elysium",
    description:
      "Um detetive amnésico investiga um assassinato em uma cidade pós-revolucionária neste RPG narrativo denso com sistema de habilidades psicológico profundo e diálogos filosóficos brilhantes sem combate tradicional.",
    "image-url": "https://storage.gamehub.com/images/disco_elysium.jpg",
    platform: [
      "PC",
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "Nintendo Switch",
    ],
    categories: ["RPG", "Aventura"],
    release: "2019-10-15",
  },
  {
    id: 70,
    titulo: "Divinity: Original Sin 2",
    description:
      "Heróis marcados buscam ascensão divina em um mundo de fantasia rico com combate tático baseado em turnos profundo, narrativa ramificada complexa e cooperativo completo para quatro jogadores.",
    "image-url": "https://storage.gamehub.com/images/divinity_os2.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["RPG", "Estratégia"],
    release: "2017-09-14",
  },
  {
    id: 71,
    titulo: "Baldur's Gate 3",
    description:
      "Infectado com um parasita de mind flayer, você deve encontrar a cura enquanto navega por decisões morais complexas neste RPG baseado em Dungeons & Dragons com combate tático profundo.",
    "image-url": "https://storage.gamehub.com/images/baldurs_gate3.jpg",
    platform: ["PC", "PlayStation 5", "Xbox Series X/S"],
    categories: ["RPG", "Estratégia"],
    release: "2023-08-03",
  },
  {
    id: 72,
    titulo: "Mass Effect Legendary Edition",
    description:
      "A trilogia completa de Mass Effect remasterizada onde o Comandante Shepard luta para salvar a galáxia de uma ameaça antiga com decisões que afetam três jogos épicos.",
    "image-url": "https://storage.gamehub.com/images/mass_effect_legendary.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["RPG", "Ação"],
    release: "2021-05-14",
  },
  {
    id: 73,
    titulo: "Dragon Age: Inquisition",
    description:
      "Como o Inquisidor, feche uma fenda no céu que derrama demônios enquanto reúne aliados, toma decisões políticas complexas e explora vastas regiões em um épico RPG de fantasia.",
    "image-url":
      "https://storage.gamehub.com/images/dragon_age_inquisition.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["RPG", "Ação"],
    release: "2014-11-18",
  },
  {
    id: 74,
    titulo: "Skyrim Special Edition",
    description:
      "Explore a vasta província nórdica de Skyrim como Dragonborn, domine shouts dracônicos, junte-se a guildas diversas e forje seu próprio destino neste RPG de mundo aberto icônico.",
    "image-url": "https://storage.gamehub.com/images/skyrim_se.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["RPG", "Mundo Aberto"],
    release: "2016-10-28",
  },
  {
    id: 75,
    titulo: "Fallout 4",
    description:
      "Sobreviva no wastelands pós-nuclear de Boston, construa assentamentos, personalize armas e equipamentos, e busque seu filho desaparecido neste RPG de ação ambientado no universo Fallout.",
    "image-url": "https://storage.gamehub.com/images/fallout4.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["RPG", "Ação", "Mundo Aberto"],
    release: "2015-11-10",
  },
  {
    id: 76,
    titulo: "Outer Wilds",
    description:
      "Explore um sistema solar preso em um loop temporal de vinte e dois minutos, descobrindo os mistérios de uma antiga civilização alienígena neste jogo de exploração contemplativo e emocionante.",
    "image-url": "https://storage.gamehub.com/images/outer_wilds.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Aventura", "Puzzle"],
    release: "2019-05-30",
  },
  {
    id: 77,
    titulo: "What Remains of Edith Finch",
    description:
      "Explore a casa da família Finch e experimente as histórias finais de seus membros amaldiçoados através de vinhetas narrativas únicas neste jogo de aventura walking simulator emocionante.",
    "image-url": "https://storage.gamehub.com/images/edith_finch.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Aventura", "Narrativa"],
    release: "2017-04-25",
  },
  {
    id: 78,
    titulo: "Firewatch",
    description:
      "Henry escapa de sua vida problemática para trabalhar como vigia florestal em Wyoming, onde uma conversa por rádio com Delilah e eventos misteriosos desenrolam uma história de suspense atmosférica.",
    "image-url": "https://storage.gamehub.com/images/firewatch.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Aventura", "Narrativa"],
    release: "2016-02-09",
  },
  {
    id: 79,
    titulo: "Gone Home",
    description:
      "Retorne para casa após uma viagem ao exterior e explore a mansão vazia de sua família descobrindo segredos através de objetos e anotações neste walking simulator intimista sobre família e identidade.",
    "image-url": "https://storage.gamehub.com/images/gone_home.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Aventura", "Narrativa"],
    release: "2013-08-15",
  },
  {
    id: 80,
    titulo: "Life is Strange",
    description:
      "Max Caulfield descobre que pode rebobinar o tempo e deve usar esse poder para salvar sua cidade natal e melhor amiga de um destino terrível neste jogo episódico de escolhas consequenciais.",
    "image-url": "https://storage.gamehub.com/images/life_is_strange.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Mobile"],
    categories: ["Aventura", "Narrativa"],
    release: "2015-01-30",
  },
  {
    id: 81,
    titulo: "Detroit: Become Human",
    description:
      "Três androides questionam sua programação e humanidade em uma Detroit futurista onde escolhas morais complexas moldam múltiplas narrativas entrelaçadas neste drama interativo cinematográfico da Quantic Dream.",
    "image-url": "https://storage.gamehub.com/images/detroit_bh.jpg",
    platform: ["PlayStation 4", "PC"],
    categories: ["Aventura", "Narrativa"],
    release: "2018-05-25",
  },
  {
    id: 82,
    titulo: "Until Dawn",
    description:
      "Oito amigos retornam a uma cabana nas montanhas onde dois deles desapareceram um ano antes, enfrentando decisões de vida ou morte em um thriller de terror interativo cinematográfico.",
    "image-url": "https://storage.gamehub.com/images/until_dawn.jpg",
    platform: ["PlayStation 4"],
    categories: ["Terror", "Aventura"],
    release: "2015-08-25",
  },
  {
    id: 83,
    titulo: "Outlast",
    description:
      "Um jornalista investigativo armado apenas com uma câmera explora um asilo psiquiátrico abandonado repleto de pacientes violentos e segredos horríveis neste survival horror intenso em primeira pessoa.",
    "image-url": "https://storage.gamehub.com/images/outlast.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Terror", "Sobrevivência"],
    release: "2013-09-04",
  },
  {
    id: 84,
    titulo: "Alien: Isolation",
    description:
      "Amanda Ripley procura sua mãe desaparecida em uma estação espacial assombrada por um Xenomorph implacável neste survival horror que captura perfeitamente o terror claustrofóbico do filme original.",
    "image-url": "https://storage.gamehub.com/images/alien_isolation.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Terror", "Sobrevivência"],
    release: "2014-10-07",
  },
  {
    id: 85,
    titulo: "Amnesia: The Dark Descent",
    description:
      "Daniel acorda em um castelo sombrio sem memórias e deve explorar seus corredores aterrorizantes enquanto evita monstros e mantém sua sanidade neste horror psicológico pioneiro.",
    "image-url": "https://storage.gamehub.com/images/amnesia_tdd.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Terror", "Aventura"],
    release: "2010-09-08",
  },
  {
    id: 86,
    titulo: "Phasmophobia",
    description:
      "Investigadores paranormais cooperativos usam equipamentos de caça fantasmas para identificar espíritos em locais assombrados enquanto tentam sobreviver a encontros aterrorizantes neste horror multiplayer único.",
    "image-url": "https://storage.gamehub.com/images/phasmophobia.jpg",
    platform: ["PC"],
    categories: ["Terror", "Multiplayer"],
    release: "2020-09-18",
  },
  {
    id: 87,
    titulo: "Resident Evil 2 Remake",
    description:
      "Leon Kennedy e Claire Redfield sobrevivem ao surto de zumbis em Raccoon City nesta reimaginação magistral do clássico survival horror com gráficos modernos e câmera sobre o ombro.",
    "image-url": "https://storage.gamehub.com/images/re2_remake.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["Terror", "Ação"],
    release: "2019-01-25",
  },
  {
    id: 88,
    titulo: "Silent Hill 2",
    description:
      "James Sunderland viaja para Silent Hill após receber uma carta de sua esposa falecida, enfrentando manifestações físicas de sua culpa e trauma neste horror psicológico atmosférico icônico.",
    "image-url": "https://storage.gamehub.com/images/silent_hill2.jpg",
    platform: ["PlayStation 2", "PC"],
    categories: ["Terror", "Aventura"],
    release: "2001-09-24",
  },
  {
    id: 89,
    titulo: "It Takes Two",
    description:
      "Cody e May, transformados em bonecas por uma maldição, devem trabalhar juntos através de mundos fantásticos diversos para salvar seu casamento neste cooperativo obrigatório criativo e emocionante.",
    "image-url": "https://storage.gamehub.com/images/it_takes_two.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
    ],
    categories: ["Aventura", "Plataforma", "Multiplayer"],
    release: "2021-03-26",
  },
  {
    id: 90,
    titulo: "A Way Out",
    description:
      "Dois prisioneiros devem cooperar para escapar da prisão e fugir das autoridades nesta aventura cooperativa cinematográfica exclusivamente para dois jogadores com tela dividida obrigatória.",
    "image-url": "https://storage.gamehub.com/images/a_way_out.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["Aventura", "Ação", "Multiplayer"],
    release: "2018-03-23",
  },
  {
    id: 91,
    titulo: "Overcooked 2",
    description:
      "Chefs cooperam para preparar pratos caóticos em cozinhas cada vez mais absurdas com obstáculos dinâmicos neste party game frenético que testa comunicação e coordenação sob pressão.",
    "image-url": "https://storage.gamehub.com/images/overcooked2.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Party", "Simulação", "Multiplayer"],
    release: "2018-08-07",
  },
  {
    id: 92,
    titulo: "Gang Beasts",
    description:
      "Lutadores gelatinosos enfrentam-se em arenas perigosas cheias de perigos ambientais neste brawler party game físico hilário e caótico perfeito para sessões multiplayer locais.",
    "image-url": "https://storage.gamehub.com/images/gang_beasts.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
    categories: ["Party", "Luta", "Multiplayer"],
    release: "2017-12-12",
  },
  {
    id: 93,
    titulo: "Mario Kart 8 Deluxe",
    description:
      "Personagens da Nintendo competem em pistas coloridas usando power-ups caóticos e karts personalizáveis neste jogo de corrida arcade acessível e competitivo perfeito para todas as idades.",
    "image-url": "https://storage.gamehub.com/images/mario_kart8.jpg",
    platform: ["Nintendo Switch"],
    categories: ["Corrida", "Party", "Multiplayer"],
    release: "2017-04-28",
  },
  {
    id: 94,
    titulo: "Super Smash Bros. Ultimate",
    description:
      "Mais de oitenta personagens icônicos de videogames se enfrentam em batalhas plataforma caóticas com mecânicas acessíveis mas profundas neste celebrado fighting game crossover da Nintendo.",
    "image-url": "https://storage.gamehub.com/images/smash_ultimate.jpg",
    platform: ["Nintendo Switch"],
    categories: ["Luta", "Party", "Multiplayer"],
    release: "2018-12-07",
  },
  {
    id: 95,
    titulo: "Street Fighter V",
    description:
      "Lutadores de todo o mundo competem em combates um contra um com mecânicas profundas, personagens diversos e sistema de V-Trigger único neste fighting game competitivo icônico da Capcom.",
    "image-url": "https://storage.gamehub.com/images/street_fighter5.jpg",
    platform: ["PlayStation 4", "PC"],
    categories: ["Luta", "Multiplayer"],
    release: "2016-02-16",
  },
  {
    id: 96,
    titulo: "Tekken 7",
    description:
      "A saga da família Mishima conclui com combates tridimensionais fluidos, roster vasto de lutadores e sistema Rage Art cinematográfico neste fighting game tecnicamente profundo e visualmente impressionante.",
    "image-url": "https://storage.gamehub.com/images/tekken7.jpg",
    platform: ["PlayStation 4", "Xbox One", "PC"],
    categories: ["Luta", "Multiplayer"],
    release: "2017-06-02",
  },
  {
    id: 97,
    titulo: "Mortal Kombat 11",
    description:
      "Lutadores clássicos e novos se enfrentam com fatalities brutais, gráficos cinematográficos e sistema de variação customizável neste fighting game maduro com história épica envolvendo viagem no tempo.",
    "image-url": "https://storage.gamehub.com/images/mk11.jpg",
    platform: [
      "PlayStation 5",
      "PlayStation 4",
      "Xbox Series X/S",
      "Xbox One",
      "PC",
      "Nintendo Switch",
    ],
    categories: ["Luta", "Ação"],
    release: "2019-04-23",
  },
  {
    id: 98,
    titulo: "Guilty Gear Strive",
    description:
      "Lutadores estilosos com mecânicas únicas se enfrentam em combates anime espetaculares com gráficos celshaded deslumbrantes e trilha sonora de rock metal neste fighting game técnico e acessível.",
    "image-url": "https://storage.gamehub.com/images/guilty_gear_strive.jpg",
    platform: ["PlayStation 5", "PlayStation 4", "PC"],
    categories: ["Luta", "Multiplayer"],
    release: "2021-06-11",
  },
  {
    id: 99,
    titulo: "Civilization VI",
    description:
      "Lidere uma civilização desde a Idade da Pedra até a Era da Informação, competindo por supremacia através de conquista, ciência, cultura ou diplomacia neste estratégia em turnos viciante e profundo.",
    "image-url": "https://storage.gamehub.com/images/civ6.jpg",
    platform: ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch", "Mobile"],
    categories: ["Estratégia", "Simulação"],
    release: "2016-10-21",
  },
  {
    id: 100,
    titulo: "StarCraft II",
    description:
      "Três raças assimétricas batalham pela supremacia galáctica em intensas partidas de estratégia em tempo real que definiram o gênero competitivo com microgerenciamento preciso e decisões macro estratégicas.",
    "image-url": "https://storage.gamehub.com/images/starcraft2.jpg",
    platform: ["PC"],
    categories: ["Estratégia", "Multiplayer"],
    release: "2010-07-27",
  },
];

let usuarios = [];

const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token de acesso requerido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎮 Bem-vindo ao GameHub API 🕹️",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/games", (req, res) => {
  const { platform, category, search, limit = 10, page = 1 } = req.query;

  let filteredGames = [...jogos];

  if (platform) {
    filteredGames = filteredGames.filter((game) =>
      game.platform.some((p) =>
        p.toLowerCase().includes(platform.toLowerCase())
      )
    );
  }

  if (category) {
    filteredGames = filteredGames.filter((game) =>
      game.categories.some((c) =>
        c.toLowerCase().includes(category.toLowerCase())
      )
    );
  }

  if (search) {
    filteredGames = filteredGames.filter((game) =>
      game.titulo.toLowerCase().includes(search.toLowerCase())
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedGames = filteredGames.slice(startIndex, endIndex);

  res.json({
    success: true,
    count: filteredGames.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredGames.length / limit),
    data: paginatedGames,
  });
});

app.get("/api/games/:id", (req, res) => {
  const game = jogos.find((g) => g.id === parseInt(req.params.id));

  if (!game) {
    return res.status(404).json({
      success: false,
      message: "Jogo não encontrado",
    });
  }

  res.json({
    success: true,
    data: game,
  });
});

app.get("/api/platforms", (req, res) => {
  const platforms = [...new Set(jogos.flatMap((game) => game.platform))];
  res.json({
    success: true,
    data: platforms.sort(),
  });
});

app.get("/api/categories", (req, res) => {
  const categories = [...new Set(jogos.flatMap((game) => game.categories))];
  res.json({
    success: true,
    data: categories.sort(),
  });
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "Username, password e email são obrigatórios",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "A senha deve ter pelo menos 6 caracteres",
      });
    }

    const existingUser = usuarios.find(
      (u) => u.username === username || u.email === email
    );
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Usuário ou email já existe",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      id: usuarios.length + 1,
      username,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    usuarios.push(newUser);

    const token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso",
      token: token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username e password são obrigatórios",
      });
    }

    const user = usuarios.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login realizado com sucesso",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

app.get("/api/profile", authenticateToken, (req, res) => {
  const user = usuarios.find((u) => u.id === req.user.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Usuário não encontrado",
    });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

app.put("/api/profile", authenticateToken, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const userIndex = usuarios.findIndex((u) => u.id === req.user.userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    if (username) usuarios[userIndex].username = username;
    if (email) usuarios[userIndex].email = email;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Senha atual é obrigatória para alterar a senha",
        });
      }

      const isCurrentPasswordValid = await verifyPassword(
        currentPassword,
        usuarios[userIndex].password
      );
      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Senha atual incorreta",
        });
      }

      usuarios[userIndex].password = await hashPassword(newPassword);
    }

    res.json({
      success: true,
      message: "Perfil atualizado com sucesso",
      data: {
        id: usuarios[userIndex].id,
        username: usuarios[userIndex].username,
        email: usuarios[userIndex].email,
        role: usuarios[userIndex].role,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

app.post("/api/games", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Apenas administradores podem criar jogos",
    });
  }

  const { titulo, description, imageUrl, platform, categories, release } =
    req.body;

  if (!titulo || !description || !platform || !categories || !release) {
    return res.status(400).json({
      success: false,
      message: "Todos os campos são obrigatórios",
    });
  }

  const existingGame = jogos.find(
    (game) => game.titulo.toLowerCase() === titulo.toLowerCase()
  );

  if (existingGame) {
    return res.status(409).json({
      success: false,
      message: "Jogo com este título já existe",
    });
  }

  const newGame = {
    id: Math.max(...jogos.map((g) => g.id)) + 1,
    titulo,
    description,
    "image-url": imageUrl,
    platform: Array.isArray(platform) ? platform : [platform],
    categories: Array.isArray(categories) ? categories : [categories],
    release,
    createdBy: req.user.userId,
    createdAt: new Date().toISOString(),
  };

  jogos.push(newGame);

  res.status(201).json({
    success: true,
    message: "Jogo criado com sucesso",
    data: newGame,
  });
});

app.put("/api/games/:id", authenticateToken, (req, res) => {
  const gameId = parseInt(req.params.id);
  const gameIndex = jogos.findIndex((g) => g.id === gameId);

  if (gameIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Jogo não encontrado",
    });
  }

  const { titulo, description, imageUrl, platform, categories, release } =
    req.body;

  if (titulo) jogos[gameIndex].titulo = titulo;
  if (description) jogos[gameIndex].description = description;
  if (imageUrl) jogos[gameIndex]["image-url"] = imageUrl;
  if (platform)
    jogos[gameIndex].platform = Array.isArray(platform) ? platform : [platform];
  if (categories)
    jogos[gameIndex].categories = Array.isArray(categories)
      ? categories
      : [categories];
  if (release) jogos[gameIndex].release = release;
  jogos[gameIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Jogo atualizado com sucesso",
    data: jogos[gameIndex],
  });
});

app.delete("/api/games/:id", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Apenas administradores podem deletar jogos",
    });
  }

  const gameId = parseInt(req.params.id);
  const gameIndex = jogos.findIndex((g) => g.id === gameId);

  if (gameIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Jogo não encontrado",
    });
  }

  const deletedGame = jogos.splice(gameIndex, 1)[0];

  res.json({
    success: true,
    message: "Jogo deletado com sucesso",
    data: deletedGame,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API está funcionando corretamente",
    timestamp: new Date().toISOString(),
    totalGames: jogos.length,
    totalUsers: usuarios.length,
  });
});

app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint não encontrado",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
  });
});

export const initializeAdminUser = async () => {
  try {
    const adminExists = usuarios.find((u) => u.role === "admin");
    if (!adminExists) {
      const hashedPassword = await hashPassword("admin123");
      usuarios.push({
        id: 1,
        username: "admin",
        email: "admin@gamehub.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date().toISOString(),
      });
      console.log("👤 Usuário admin criado: admin / admin123");
    };

    export default app;
  console.log(`🎮 Servidor GameHub rodando na porta ${PORT}`);
  console.log(`📚 Total de jogos na base: ${jogos.length}`);
  console.log(`👥 Total de usuários: ${usuarios.length}`);
});
