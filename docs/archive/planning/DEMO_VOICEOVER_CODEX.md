# SangeetFit — moving walkthrough voiceover

Record this separately. These timestamps match the 87-second full-screen walkthrough, `work/video-codex/out/SangeetFit-walkthrough.mp4`. Read naturally, leaving short pauses. There is no audio track in the video.

**0:00–0:05**

Five wedding celebrations. Plenty of clothes. What goes where? Meet SangeetFit.

**0:05–0:10**

Start with the five-event board. Each celebration gets its own outfit choice.

**0:10–0:26**

First, add a garment you own. Give it a name and choose the events it could work for. This demo uses an AI concept as a sample garment.

**0:26–0:34**

Need inspiration? Browse labelled AI outfit ideas, and choose which look you want to preview.

**0:34–0:37**

Now, let’s preview one look.

**0:37–0:43**

Here is a recorded live run. Add the AI demo photo and press Generate.

**0:43–0:50**

YouCam Cloth V4 takes the photo and garment. The server polls for the result. This wait is shortened.

**0:50–1:02**

Here is the genuine generated result. Move the slider to compare it with the original photo. It offers visual guidance, not a guarantee of fit.

**1:02–1:17**

Back in the sample planner, choose outfits for the remaining events. Reuse the same garment for Reception, and the board marks a planned rewear. All five events now have a choice.

**1:17–1:24**

Save a simple PDF: event names and outfit choices, without photos or links.

**1:24–1:27**

SangeetFit. Your wedding week, planned.

## Recording notes

Fresh local mock app footage and the original 31 October live YouCam recording are separate demonstrations. The sample garment and demo person are AI-created. The live wait excerpt is shown at 4×; the original generation took 26.021 seconds. No new provider request was run. No assembled Claude video, still image sequence, synthetic narration or music is used.

Save your recording separately. Watch and listen to the combined video after adding it. Nothing has been published.

## Add your audio later

Record to `work/video-codex/out/voiceover.m4a`, then combine it with the video:

```sh
ffmpeg -y -i work/video-codex/out/SangeetFit-walkthrough.mp4 -i work/video-codex/out/voiceover.m4a -filter_complex "[1:a]apad,atrim=duration=86.766667[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -movflags +faststart work/video-codex/out/SangeetFit-walkthrough-vo.mp4
```

This pads shorter recordings with silence and trims audio beyond the video end.
Watch and listen to the finished combined export before uploading.

Edit references: [official event rules](https://youcam-api-skin-ai-ecommerce.devpost.com/rules) and [Devpost demo guidance](https://help.devpost.com/article/84-video-making-best-practices).
