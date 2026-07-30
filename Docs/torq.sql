-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 31, 2026 at 12:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `torq`
--

-- --------------------------------------------------------

--
-- Table structure for table `bikes`
--

CREATE TABLE `bikes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `make` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `last_service` date DEFAULT NULL,
  `last_service_mileage` int(11) DEFAULT NULL,
  `mot_expiry_date` date DEFAULT NULL,
  `tax_expiry_date` date DEFAULT NULL,
  `insurance_expiry_date` date DEFAULT NULL,
  `spec_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`spec_json`)),
  `last_synced_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bikes`
--

INSERT INTO `bikes` (`id`, `user_id`, `make`, `model`, `year`, `mileage`, `last_service`, `last_service_mileage`, `mot_expiry_date`, `tax_expiry_date`, `insurance_expiry_date`, `spec_json`, `last_synced_at`, `created_at`, `updated_at`) VALUES
(2, 12, 'Honda', 'CB125F', 2017, 24000, NULL, 20000, '2027-07-23', '2026-05-28', '2027-06-09', '{\"make\":\"Honda\",\"model\":\"CB125F\",\"year\":\"2017\",\"type\":\"Sport\",\"displacement\":\"124.7 ccm (7.61 cubic inches)\",\"engine\":\"Single cylinder, four-stroke\",\"compression\":\"9.2:1\",\"bore_stroke\":\"52.4 x 57.8 mm (2.1 x 2.3 inches)\",\"valves_per_cylinder\":\"2\",\"fuel_system\":\"Carburettor\",\"fuel_control\":\"Overhead Cams (OHC)\",\"lubrication\":null,\"cooling\":\"Air\",\"gearbox\":\"5-speed\",\"transmission\":\"Chain   (final drive)\",\"clutch\":\"Wet, multiplate with coil springs\",\"frame\":null,\"front_suspension\":\"120mm telescopic fork (31mm diameter)\",\"front_wheel_travel\":null,\"rear_suspension\":\"Dual rear shocks with 5-step spring preload adjustment\",\"rear_wheel_travel\":null,\"front_tire\":\"80/100-18\",\"rear_tire\":\"90/90-18\",\"front_brakes\":\"Single disc. Two-piston calipers.\",\"rear_brakes\":\"Expanding brake (drum brake)\",\"seat_height\":\"775 mm (30.5 inches) If adjustable, lowest setting.\",\"ground_clearance\":\"160 mm (6.3 inches)\",\"wheelbase\":\"1295 mm (51.0 inches)\",\"fuel_capacity\":\"13.00 litres (3.43 US gallons)\",\"starter\":\"Electric\",\"power\":\"10.5 HP (7.6  kW)) @ 7750 RPM\",\"torque\":\"10.2 Nm (1.0 kgf-m or 7.5 ft.lbs) @ 6250 RPM\",\"top_speed\":null,\"fuel_consumption\":\"1.56 litres/100 km (64.1 km/l or 150.78 mpg)\",\"emission\":\"36.2 CO2 g/km. (CO2 - Carbon dioxide emission)\",\"total_weight\":\"128.0 kg (282.2 pounds)\",\"total_height\":null,\"total_length\":\"2026 mm (79.8 inches)\",\"total_width\":\"765 mm (30.1 inches)\",\"ignition\":null,\"dry_weight\":null}', '2026-07-14 19:57:22', '2026-07-14 19:57:22', '2026-07-14 19:57:37'),
(7, 21, 'Yamaha', 'YZF-R1', 2022, 15161, '2026-01-01', NULL, '2027-05-16', '2027-08-18', '2027-06-30', '{\"make\":\"Yamaha\",\"model\":\"YZF-R1\",\"year\":\"2022\",\"type\":\"Sport\",\"displacement\":\"998.0 ccm (60.90 cubic inches)\",\"engine\":\"In-line four, four-stroke\",\"compression\":\"13.0:1\",\"bore_stroke\":\"79.0 x 50.9 mm (3.1 x 2.0 inches)\",\"valves_per_cylinder\":\"4\",\"fuel_system\":\"Injection. Fuel Injection with YCC-T and YCC-I\",\"fuel_control\":\"Double Overhead Cams/Twin Cam (DOHC)\",\"lubrication\":null,\"cooling\":\"Liquid\",\"gearbox\":\"6-speed\",\"transmission\":\"Chain   (final drive)\",\"clutch\":\"Multiplate assist and slipper clutch\",\"frame\":\"Aluminum Deltabox\",\"front_suspension\":\"43mm KYB® inverted fork; fully adjustable\",\"front_wheel_travel\":\"119 mm (4.7 inches)\",\"rear_suspension\":\"KYB® piggyback shock, 4-way adjustable\",\"rear_wheel_travel\":\"119 mm (4.7 inches)\",\"front_tire\":\"120/70-ZR17\",\"rear_tire\":\"190/55-ZR17\",\"front_brakes\":\"Double disc. ABS. Hydraulic. Four-piston calipers.\",\"rear_brakes\":\"Single disc. ABS.\",\"seat_height\":\"856 mm (33.7 inches) If adjustable, lowest setting.\",\"ground_clearance\":\"130 mm (5.1 inches)\",\"wheelbase\":\"1405 mm (55.3 inches)\",\"fuel_capacity\":\"17.03 litres (4.50 US gallons)\",\"starter\":\"Electric\",\"power\":\"200.0 HP (146.0  kW)) @ 13500 RPM\",\"torque\":\"112.4 Nm (11.5 kgf-m or 82.9 ft.lbs) @ 11500 RPM\",\"top_speed\":null,\"fuel_consumption\":\"7.13 litres/100 km (14.0 km/l or 32.99 mpg)\",\"emission\":\"165.4 CO2 g/km. (CO2 - Carbon dioxide emission)\",\"total_weight\":\"203.2 kg (448.0 pounds)\",\"total_height\":\"1166 mm (45.9 inches)\",\"total_length\":\"2055 mm (80.9 inches)\",\"total_width\":\"691 mm (27.2 inches)\",\"ignition\":\"TCI: Transistor Controlled Ignition\",\"dry_weight\":null}', '2026-07-14 20:41:28', '2026-07-14 20:41:28', '2026-07-14 20:41:38'),
(8, 25, 'Yamaha', 'R125', 2022, NULL, NULL, 245345, '2027-06-17', '2026-11-06', NULL, '{\"make\":\"Yamaha\",\"model\":\"R125\",\"year\":\"2022\",\"type\":\"Sport\",\"displacement\":\"124.7 ccm (7.61 cubic inches)\",\"engine\":\"Single cylinder, four-stroke\",\"compression\":\"11.2:1\",\"bore_stroke\":\"52.0 x 58.6 mm (2.0 x 2.3 inches)\",\"valves_per_cylinder\":\"4\",\"fuel_system\":\"Injection\",\"fuel_control\":\"Single Overhead Cams (SOHC)\",\"lubrication\":\"Wet sump\",\"cooling\":\"Liquid\",\"gearbox\":\"6-speed\",\"transmission\":\"Chain   (final drive)\",\"clutch\":\"Wet, multiple-disc coil spring assist and slipper clutch\",\"frame\":\"Steel deltabox, aluminum swingarm\",\"front_suspension\":\"Upside-down telescopic fork, 41  mm\",\"front_wheel_travel\":\"130 mm (5.1 inches)\",\"rear_suspension\":\"Swingarm, link\",\"rear_wheel_travel\":\"114 mm (4.5 inches)\",\"front_tire\":\"110/80-17\",\"rear_tire\":\"140/70-17\",\"front_brakes\":\"Single disc\",\"rear_brakes\":\"Single disc\",\"seat_height\":\"825 mm (32.5 inches) If adjustable, lowest setting.\",\"ground_clearance\":\"155 mm (6.1 inches)\",\"wheelbase\":\"1355 mm (53.3 inches)\",\"fuel_capacity\":\"11.50 litres (3.04 US gallons)\",\"starter\":\"Electric\",\"power\":\"14.8 HP (10.8  kW)) @ 10000 RPM\",\"torque\":\"11.5 Nm (1.2 kgf-m or 8.5 ft.lbs) @ 8000 RPM\",\"top_speed\":null,\"fuel_consumption\":\"2.10 litres/100 km (47.6 km/l or 112.01 mpg)\",\"emission\":\"48.7 CO2 g/km. (CO2 - Carbon dioxide emission)\",\"total_weight\":\"144.0 kg (317.5 pounds)\",\"total_height\":\"1065 mm (41.9 inches)\",\"total_length\":\"1955 mm (77.0 inches)\",\"total_width\":\"680 mm (26.8 inches)\",\"ignition\":\"TCI\",\"dry_weight\":null}', '2026-07-17 20:40:39', '2026-07-17 20:40:39', '2026-07-17 20:40:46'),
(11, 30, 'Indian', 'Scout', 2022, 2130, NULL, 2000, '2026-11-19', '2026-10-29', '2026-11-03', '{\"make\":\"Indian\",\"model\":\"Scout\",\"year\":\"2022\",\"type\":\"Custom / cruiser\",\"displacement\":\"1133.0 ccm (69.14 cubic inches)\",\"engine\":\"V2, four-stroke\",\"compression\":\"10.7:1\",\"bore_stroke\":\"99.0 x 73.6 mm (3.9 x 2.9 inches)\",\"valves_per_cylinder\":null,\"fuel_system\":\"Injection. Closed Loop Fuel Injection, 60 mm Bore\",\"fuel_control\":null,\"lubrication\":null,\"cooling\":\"Liquid\",\"gearbox\":\"6-speed\",\"transmission\":\"Belt   (final drive)\",\"clutch\":\"Wet, Multi-Plate. Gear Drive Wet Clutch.\",\"frame\":null,\"front_suspension\":\"Telescopic fork\",\"front_wheel_travel\":\"120 mm (4.7 inches)\",\"rear_suspension\":\"Dual shock\",\"rear_wheel_travel\":\"76 mm (3.0 inches)\",\"front_tire\":\"130/90-16\",\"rear_tire\":\"150/80-16\",\"front_brakes\":\"Single disc. Optional ABS. Two-piston calipers.\",\"rear_brakes\":\"Single disc. Optional ABS. Single-piston caliper.\",\"seat_height\":\"649 mm (25.6 inches) If adjustable, lowest setting.\",\"ground_clearance\":\"145 mm (5.7 inches)\",\"wheelbase\":\"1576 mm (62.0 inches)\",\"fuel_capacity\":\"12.50 litres (3.30 US gallons)\",\"starter\":\"Electric\",\"power\":\"100.0 HP (73.0  kW))\",\"torque\":\"97.6 Nm (10.0 kgf-m or 72.0 ft.lbs) @ 5900 RPM\",\"top_speed\":null,\"fuel_consumption\":null,\"emission\":null,\"total_weight\":\"261.0 kg (575.4 pounds)\",\"total_height\":\"1068 mm (42.0 inches)\",\"total_length\":\"2324 mm (91.5 inches)\",\"total_width\":\"916 mm (36.1 inches)\",\"ignition\":null,\"dry_weight\":\"245.0 kg (540.1 pounds)\"}', '2026-07-23 10:03:44', '2026-07-23 10:03:44', '2026-07-23 10:03:55');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `description`, `event_date`, `start_time`, `end_time`, `image_url`, `location`, `created_at`, `updated_at`) VALUES
(1, 'Glasgow Green Bike Meet', 'Casual monthly meet-up for local riders, grab a coffee, look at bikes, plan the next group ride.', '2026-08-02', '10:00:00', '13:00:00', NULL, 'Riverside car park, Glasgow', '2026-07-14 22:16:53', '2026-07-17 23:28:03');

-- --------------------------------------------------------

--
-- Table structure for table `hotspots`
--

CREATE TABLE `hotspots` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hotspots`
--

INSERT INTO `hotspots` (`id`, `name`, `description`, `location`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Loch Lomond loop', 'A classic scenic loop hugging the loch shore, with sweeping bends and plenty of spots to stop for photos. Busy in summer weekends, so an early start is worth it.', 'Loch Lomond, G83', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', '2026-07-17 21:56:37', '2026-07-17 21:56:37'),
(2, 'Trossachs trail', 'Twisty forest roads through the Trossachs with a real mix of tight corners and open straights. Surface can get greasy after rain, so worth taking it steady.', 'The Trossachs, FK17', NULL, '2026-07-17 21:56:37', '2026-07-17 21:56:37'),
(3, 'Clyde coast run', 'A relaxed coastal run along the Firth of Clyde, good for an easy evening ride with sea views most of the way. Several harbour towns along the route for a coffee stop.', 'Clyde coast, PA13', 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=800&q=80', '2026-07-17 21:56:37', '2026-07-17 21:56:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `postcode` varchar(10) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `display_name`, `created_at`, `updated_at`, `postcode`, `latitude`, `longitude`) VALUES
(10, 'chantelle.hume@hotmail.com', '$2a$10$n16oYERTEV1i6gFh8UrvxOTyF749jXnMbp0iA5miCK/sPFEcwjYcq', 'chantelle', '2026-07-14 19:51:28', '2026-07-14 19:51:28', NULL, NULL, NULL),
(11, 'chafasdfo@sdg', '$2a$10$12jRzCXfphWbNMn2ao.TFeKxYfBi6dD3JdKiWnjSbaKGTbaqqamJK', 'CHANTELLE', '2026-07-14 19:53:44', '2026-07-14 19:53:44', NULL, NULL, NULL),
(12, 'chantelle.hume@hsgdg', '$2a$10$xavD/aklhCsO1wd28FK26.XtYnPBvDFKGhxz5XOBfxnNnMqmmojGq', 'usdifhbius', '2026-07-14 19:56:42', '2026-07-14 19:56:42', NULL, NULL, NULL),
(21, 'chantelle.hume@hotgdfgdfghd', '$2a$10$lnEhKHDEjphVORxxHg0hr.0EGDPuqw021yLRQyXh7SOi1x.aL0SO2', 'ggd', '2026-07-14 20:40:47', '2026-07-14 20:41:41', 'G459AU', 55.804073, -4.234538),
(25, 'fjkdfns@lmfsdkgp', '$2a$10$ajkfUaStGjp5AkPP1GEAAunc6thJjoR5paE.0V2oEeDgU3etjaPq6', 'ertwet', '2026-07-17 20:40:17', '2026-07-17 20:40:47', 'g732eb', 55.823505, -4.230974),
(27, 'legacyscan.1784330957701@example.com', '$2a$10$/JQSUQCDy4TWd1.4XUFaHepwSS5AIlDkiv0RL2oNxrgrj7eJpBqKq', 'Legacy Scan Tester', '2026-07-17 23:29:21', '2026-07-17 23:29:21', 'G1 1XQ', NULL, NULL),
(30, 'fsdgsdf@gdsf', '$2a$10$qR9uDYTSvBgAbTT4P3LzEeP.wWcxIjZvBHmpFRWJwvtWaVpcmdIJq', 'gfdg', '2026-07-23 10:03:12', '2026-07-23 10:03:57', 'g732eb', 55.823505, -4.230974);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bikes`
--
ALTER TABLE `bikes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bikes_user` (`user_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hotspots`
--
ALTER TABLE `hotspots`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bikes`
--
ALTER TABLE `bikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `hotspots`
--
ALTER TABLE `hotspots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bikes`
--
ALTER TABLE `bikes`
  ADD CONSTRAINT `fk_bikes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
