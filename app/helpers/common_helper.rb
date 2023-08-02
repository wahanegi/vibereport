module CommonHelper
  def bytes_to_megabytes(bytes)
    megabytes = bytes.to_f / 1_048_576
    format('%.1f', megabytes)
  end
end
