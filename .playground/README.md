# AlunaJS / Playground

Test things out quick and easy.

<!--
Live API explorer:
  - http://playground.aluna.social -->

# TL;DR

```bash
yarn playground
```

## AlunaRC
> Before moving on, be sure to set up your `.alunarc`:
> - [Setting up `.alunarc`](../docs/alunarc.md)


# Insomnia

Insomnia is a REST spec / explorer tool that we use for this purpose.

Let's get started:.

1. Download and install [Insomnia](https://insomnia.rest/)
1. Install the [dotenv](https://insomnia.rest/plugins/insomnia-plugin-dotenv) plugin
2. Then go to `Data` -> `Import Data` -> `From File`
3. Import the file `<repo-root>/.playground/aluna-spec.json` file
4. Voilà


# Start the Server

This will start the Playground http server:

```bash
yarn playground
```

# Explore API

On Insomnia, select the desired Exchange:

![exchanges](https://user-images.githubusercontent.com/26660/168837163-10561c7e-e8f3-4ad2-b60a-2bcf59d985fb.png)

Then try out all the available methods:

![methods](https://user-images.githubusercontent.com/26660/168837201-682e5a85-bc35-4c68-b119-910162222f21.png)

