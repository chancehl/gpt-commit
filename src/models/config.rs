use serde::{Deserialize, Serialize};

use std::{error::Error, fs::File, io::BufReader, path::PathBuf};

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct ApplicationConfigData {
    gitmoji: bool,
}

#[derive(Debug)]
pub struct ApplicationConfig {
    path: PathBuf,
    data: ApplicationConfigData,
}

#[derive(Debug, Default)]
pub struct ApplicationConfigBuilder {
    path: PathBuf,
    data: Option<ApplicationConfigData>,
}

impl ApplicationConfig {
    pub fn builder() -> ApplicationConfigBuilder {
        ApplicationConfigBuilder::default()
    }
}

impl ApplicationConfigBuilder {
    pub fn path(&mut self, path: &PathBuf) -> &mut ApplicationConfigBuilder {
        self.path = path.to_path_buf();
        self
    }

    pub fn data(&mut self, data: ApplicationConfigData) -> &mut ApplicationConfigBuilder {
        self.data = Some(data);
        self
    }

    pub fn build(self) -> Result<ApplicationConfig, Box<dyn Error>> {
        if self.data.is_none() {
            let file = File::open(&self.path)?;
            let reader = BufReader::new(file);

            let data = serde_json::from_reader(reader)?;

            return Ok(ApplicationConfig {
                path: self.path,
                data: data,
            });
        }

        Ok(ApplicationConfig {
            path: self.path,
            data: ApplicationConfigData::default(),
        })
    }
}
