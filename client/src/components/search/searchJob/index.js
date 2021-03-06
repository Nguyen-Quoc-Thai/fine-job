import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import styles from "./search.module.scss";

function SearchJobBar({ defaultValue = "", onsearch }) {
  const { t } = useTranslation();
  const searchInput = useRef(null);

  useEffect(() => {
    setInputFocus();
  }, []);

  const setInputFocus = () => {
    searchInput.current.focus();
  };

  const handleSearch = () => {
    if (onsearch) {
      onsearch(searchInput.current.value);
    }
  };

  return (
    <div className={styles.container}>
      <Grid container spacing={3}>
        <Grid item md={5}>
          <div className={styles.searchbar}>
            <button onClick={setInputFocus} className={styles.searchbar__icon}>
              <Search />
            </button>
            <input
              defaultValue={defaultValue}
              ref={searchInput}
              type="text"
              placeholder={t("job.searchPlaceholder")}
              className={styles.searchbar__input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
        </Grid>
        <Grid item>
          <button
            className={styles.searchbar__searchBtn}
            onClick={handleSearch}
          >
            {t("job.searchButton")}
          </button>
        </Grid>
      </Grid>
    </div>
  );
}

export default SearchJobBar;
