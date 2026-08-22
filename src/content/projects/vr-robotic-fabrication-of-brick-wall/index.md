---
title: 'VIVE-Tracked Robotic Bricklaying on Site'
subtitle: '1,430 bricks, 52 layers, double-curved — a mobile UR10 sequenced through a wall larger than its own reach'
type: 'Research'
featured: true
domains:
  - Robotics
  - Computational Design
  - Real-Time Tracking

stack:
  - Python
  - SteamVR/OpenVR
  - Rhino / Grasshopper
  - UR10
  - HTC VIVE

created: 2023-12-02
category: 'AR/VR'
tags: ['HTC VIVE', 'Robotic Fabrication', 'On-site']
image: './brickwall.jpg'
hoverImage: './brickwall.webp'
thumbnail: './vr-robotic-fabrication-of-brick-wall.jpg'
info: 'Realtime HTC VIVE tracking locates the on-site UR10 relative to the double-curved wall for precise robotic fabrication.'
description: 'This project constructs a 3 m × 6.7 m fundraising brick wall using the HTC VIVE tracker system to locate the relative coordinates between the double-curved wall geometry and the on-site UR10 robotic arm, enabling precise robotic fabrication.'
role: 'Research Assistant'
timeline: '3 months'
completed: '11/2017'
credit: 'CCC Lab, Tamkang University'
creditLink: 'https://vimeo.com/digitalaieou'
tools:
  [
    'Rhino / Grasshopper', 'Python', 'SteamVR/OpenVR', 'Rhino / Grasshopper', 'Universal Robot 10', 'HTC VIVE'
  ]
focus:
  [
    'Spatial Tracking',
    'Robotic Fabrication',
    'Digital-to-Physical Workflow',
    'Computational Design',
  ]
activities: 'I was responsible for completing the development of the robotic system and fabricating the brick walls on site.'
---

<div class="contentSection">

## Background

My role was to fabricate the fundraising brick wall on site, and to take the real-time positioning system — an HTC VIVE Tracker integrated with a UR10 robotic arm — from a working lab rig to something that held up through 22 re-registrations on a live construction site.

#### The work began with two challenges:

1. How to reposition a robotic system on a construction site, and
2. How to use VR-based tracking to locate building components in situ?

#

![vr-vive-brick-wall](./VIVE.jpg)

</div>

<div class="contentSection">

## On-Site Robotic Setup

The UR10 robotic arm was mounted on a mobile station for on-site deployment. A pickup area for 20×10×5 cm wooden bricks was integrated at the base of the station.

![vr-vive-brick-wall-setup](./setup.jpg)

</div>

<div class="contentSection">

## VR–Robotics Integration Pipeline

HTC VIVE tracking was used to collect real-time positional data. Using Rhino3D, Grasshopper3D, SteamVR, OpenVR, and Python, we created a virtual environment that synchronized with the physical site.

![vr-vive-brick-wall-pipeline](./pipeline.jpg)

</div>

<div class="contentSection">

## Robotic Fabrication Simulation

The VIVE Tracker provided relative coordinates between the UR10 and a reference block. This data allowed us to simulate and execute the fabrication process: each cycle placed 80–120 bricks within 1–2 hours, ensuring the UR10 avoided collisions. Once an area was completed, the robot was repositioned to continue the build.

![vr-vive-brick-wall-simulation-2](./simulation_2.jpg)

</div>

<div class="contentSection">

## Construction Sequence

Throughout construction, the UR10 was repositioned 22 times to complete 38 layers totaling 1,024 bricks. Due to ceiling height limitations, the remaining 14 layers (406 bricks) could not be reached in place, so the robot built them as prefabricated components off the wall and we installed them by hand. All 1,430 bricks were laid by the robot.

![vr-vive-brick-wall-sequence](./sequence.webp)

</div>

## Welcome to watch the video below.

<div class="embedFrame">

<iframe class="responsive-iframe" title="vimeo-player" width="100%" height="100%" loading="lazy" src="https://player.vimeo.com/video/244675340" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>

</div>

<div class="contentSection">

## Team

Prof. Chen-Cheng Chen, You-Wen Ji, Ying-Shiuan Chen, Ching-Yin Wang

</div>
