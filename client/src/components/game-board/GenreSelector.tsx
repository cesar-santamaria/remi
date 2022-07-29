import React, { useEffect, useState, useContext } from "react";
import { IArtistContext, IGenreSelector } from "../../Interfaces";
import AdvancedSettings from "./AdvancedSettings";

import { ArtistContext } from "../../Game";

// material UI
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const GenreSelector = (props: IGenreSelector) => {
  const [advancedSettings, setAdvancedSettings] = useState<boolean>(false);
  const [alightment, setAlignment] = useState<string | null>("pop");
  const context: IArtistContext = useContext<IArtistContext>(ArtistContext);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    if (newAlignment !== "advanced-settings") {
      props.selectGenre(newAlignment);
    }
    setAlignment(newAlignment);
  };

  useEffect(() => {
    if (alightment === "advanced-settings") {
      setAdvancedSettings(true);
    }
    if (alightment !== "advanced-settings" && advancedSettings !== false) {
      setAdvancedSettings(false);
      context.setArtist(null);
    }
    return;
  }, [alightment]);

  return (
    <>
      <ToggleButtonGroup
        value={alightment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="pop" aria-label="pop" color="primary">
          Pop
        </ToggleButton>
        <ToggleButton value="rock" aria-label="rock" color="primary">
          Rock
        </ToggleButton>
        <ToggleButton value="r-n-b" aria-label="r-n-b" color="primary">
          R&B
        </ToggleButton>
        <ToggleButton value="k-pop" aria-label="k-pop" color="primary">
          K-Pop
        </ToggleButton>
        <ToggleButton
          value="advanced-settings"
          aria-label="advanced-settings"
          color="primary"
        >
          Advanced
        </ToggleButton>
      </ToggleButtonGroup>
      {advancedSettings && (
        <AdvancedSettings
          selectGenre={props.selectGenre}
          advancedSettings={advancedSettings}
        />
      )}
    </>
  );
};

export default GenreSelector;
